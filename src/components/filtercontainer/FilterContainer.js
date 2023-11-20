import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../contexts/AppContext';
import { InputNumber } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons'; // 选择合适的图标库
import { faArrowRight, faTrash, faAdd } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

import { DatePicker } from 'antd';
import 'antd/dist/reset.css'; // 引入样式
import Switch from 'react-switch';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';

function TooltipComponent({ text }) {
  return (
    <div className="tooltip">
      <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" />
      <span className="tooltiptext">{text}</span>
    </div>
  );
}


const FilterContainer = () => {
  const { showFilterTool, startDate, setStartDate, setTags, endDate, setEndDate, tags, selectedRecommendation } = useContext(AppContext);
  const { isRealTimeUpdate, setIsRealTimeUpdate, resultCount, setResultCount, popdays, setPopdays } = useContext(AppContext);

  const { isDateFilterEnabled, setIsDateFilterEnabled, isTagFilterEnabled, setIsTagFilterEnabled } = useContext(AppContext);

  const { tagGroups, setTagGroups } = useContext(AppContext);

  const [hoveredGroupIndex, setHoveredGroupIndex] = useState(null);


  const [availableTags, setAvailableTags] = useState(null);

  useEffect(() => {
    axios.get('https://bangrecs.net/api/v4/tags_list/')
      .then(response => {
        setAvailableTags(response.data);
      })
      .catch(error => {
        console.error('Error fetching tags:', error);
      });
  }, []);

  // const [autoSuggestValue, setAutoSuggestValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const getSuggestions = (value, availableTags) => {
    if (!availableTags) {
      return [];
    }

    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : availableTags.filter(tag =>
      tag.toLowerCase().includes(inputValue)
    );
  };

  const onSuggestionsFetchRequested = ({ value }) => {

    setSuggestions(getSuggestions(value, availableTags).slice(0, 10));
  };


  const theme = {
    container: 'my-custom-container',
    input: 'my-custom-input',
    suggestionsContainer: 'my-custom-suggestions-container',
    suggestion: 'my-custom-suggestion',
    suggestionHighlighted: 'my-custom-suggestion--highlighted',
    suggestionsContainerOpen: 'my-custom-suggestions-container--open',
    suggestionsList: 'my-custom-suggestions-list',
    suggestionSelected: 'my-custom-suggestion--selected',
    sectionContainer: 'my-custom-section-container',
    sectionTitle: 'my-custom-section-title',
    sectionSuggestionsContainer: 'my-custom-section-suggestions-container'
  };



  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };


  const handleTagChange = (eOrValue, groupIndex, tagIndex) => {
    let newValue;

    if (typeof eOrValue === 'object' && eOrValue !== null && 'target' in eOrValue) {
      newValue = eOrValue.target.value;
    } else {
      newValue = eOrValue;
    }

    const newTagGroups = [...tagGroups];
    newTagGroups[groupIndex][tagIndex] = newValue;
    setTagGroups(newTagGroups);
  };


  const addTagInput = (groupIndex) => {
    const newTagGroups = [...tagGroups];
    newTagGroups[groupIndex].push('');
    setTagGroups(newTagGroups);
  };

  const removeTagInput = (groupIndex, tagIndex) => {
    const newTagGroups = [...tagGroups];
    newTagGroups[groupIndex].splice(tagIndex, 1);
    setTagGroups(newTagGroups);
  };

  const addTagGroup = () => {
    const newTagGroups = [...tagGroups];
    newTagGroups.push([]); // 添加一个新的空数组到 newTagGroups

    // 为新组添加一个空标签
    newTagGroups[newTagGroups.length - 1].push('');

    setTagGroups(newTagGroups); // 更新状态
  };


  const removeTagGroup = (groupIndex) => {
    const newTagGroups = [...tagGroups];
    newTagGroups.splice(groupIndex, 1);
    setTagGroups(newTagGroups);
  };

  



  return (
    showFilterTool && (
      <div className="filter-container">

        {selectedRecommendation !== "s" && (
          <div className="filter-group">
            <label>返回数量: </label>
            <InputNumber
              min={1}
              value={resultCount}
              max={50}
              step={5}
              onChange={setResultCount}
              style={{ margin: '0 10px' }}
            />
          </div>
        )}


        {!["s", "trans", "pop"].includes(selectedRecommendation) && (
          <div className="filter-group">
            <TooltipComponent text="同步当前用户的最新收藏。(对查询速度影响较大)" />
            <label>实时更新: </label>
            <Switch
              checked={isRealTimeUpdate}
              onChange={setIsRealTimeUpdate}
              uncheckedIcon={false}
              checkedIcon={false}
            />

          </div>
        )}


        {selectedRecommendation === "pop" && (
          <div className="filter-group">
            <TooltipComponent text={`近似计算近 ${popdays}天以来的流行作品。`} />
            <label>计算天数: </label>
            <InputNumber
              min={1}
              value={popdays}
              max={365}
              step={7}
              onChange={setPopdays}
              style={{ margin: '0 10px' }}
            />
          </div>
        )}

        {!["trans"].includes(selectedRecommendation) && (<div className="filter-group">
          <TooltipComponent text="设定候选作品的时间范围, 格式YYYY-M-D。" />
          <label>时间过滤: </label>
          <Switch
            checked={isDateFilterEnabled}
            onChange={() => {
              setIsDateFilterEnabled(!isDateFilterEnabled);
              setStartDate(new Date(1900, 0, 1));
              setEndDate(new Date())
            }}
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </div>)}

        {isDateFilterEnabled && (
          <div className="filter-group">
            {/* <label>时间: </label> */}
            <DatePicker selected={startDate} 
            format={"YYYY-M-D"} 
            onChange={(date) => {
              // setStartDate(parseDate(date));
              setStartDate(date);
              }} />

            <FontAwesomeIcon icon={faArrowRight} style={{ margin: '0 8px' }} />
            <DatePicker format={"YYYY-M-D"} selected={endDate} onChange={(date) => setEndDate(date)} />
          </div>
        )}

        {!["trans"].includes(selectedRecommendation) && (<div className="filter-group">
          <TooltipComponent text="设定候选作品的标签。(组内关系为且，组间关系为或)" />
          <label>标签过滤: </label>
          <Switch
            checked={isTagFilterEnabled}
            onChange={() => setIsTagFilterEnabled(!isTagFilterEnabled)}
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </div>)}

        {isTagFilterEnabled && (
          <>
            <div className="filter-group">
              <div>
                {tagGroups.map((tags, groupIndex) => (

                  <div className="filter-group" style={{ backgroundColor: hoveredGroupIndex === groupIndex ? 'rgba(255, 0, 0, 0.2)' : 'white' }} key={groupIndex}>
                    <div className="tags-container">


                      {tags.map((tag, tagIndex) => (
                        <div key={tagIndex} className="tag-input-container">
                          <FontAwesomeIcon icon={faTag} className="tag-icon" />
                          <Autosuggest
                            suggestions={suggestions}
                            theme={theme}
                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={onSuggestionsClearRequested}
                            getSuggestionValue={suggestion => suggestion}
                            renderSuggestion={suggestion => <div>{suggestion}</div>}
                            inputProps={{
                              id: 'tag-input',
                              type: 'text',
                              value: tag, // 使用现有的状态
                              onChange: (_, { newValue }) => handleTagChange(newValue, groupIndex, tagIndex),
                            }}
                          />
                          <button id="removetag" onClick={() => removeTagInput(groupIndex, tagIndex)}>×</button>
                        </div>
                      ))}
                    </div>
                    <button id="addtag" onClick={() => addTagInput(groupIndex)}>+</button>

                    <button
                      className="removeGroup-icon"
                      onMouseEnter={() => setHoveredGroupIndex(groupIndex)}
                      onMouseLeave={() => setHoveredGroupIndex(null)}
                      onClick={() => removeTagGroup(groupIndex)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>


                  </div>
                ))}
                <button id="addTagGroup" onClick={addTagGroup}><FontAwesomeIcon icon={faAdd}></FontAwesomeIcon> 新标签组</button>
                {/* <button id="addTagGroup" onClick={() => { addTagGroup(); addTagInput(tagGroups.length - 1); }}><FontAwesomeIcon icon={faAdd}></FontAwesomeIcon> 新标签组</button> */}
              </div>

            </div>

            <div>
              {tagGroups.length > 0 && (
                <div>
                  {tagGroups.map((tags, groupIndex, arr) => {
                    // 过滤掉空字符串
                    const nonEmptyTags = tags.filter(tag => tag.trim() !== "");

                    return (
                      <React.Fragment key={groupIndex}>
                        {nonEmptyTags.length === 0 ? null : (
                          <div style={{ marginLeft: '20px' }}>
                            {groupIndex !== 0 && <><br />  </>}
                            {nonEmptyTags.length === 1 ? ` 包含 ['${nonEmptyTags.join('\',\'')}'] 标签` :
                              ` 同时包含 ['${nonEmptyTags.join('\',\'')}'] 标签`}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          </>)
        }


      </div>
    )
  );
}

export default FilterContainer;
