import React, { useContext, useState, useRef, useEffect } from 'react';

import AppContext from '../contexts/AppContext';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';


function TooltipComponent({ text }) {
  return (
    <div className="tooltip">
      <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" />
      <span className="tooltiptext">{text}</span>
    </div>
  );
}


function _Tooltip({ x }) {
  switch (x) {
    case "MF":
      return <TooltipComponent text="传统模型MF(这是一个保守的模型，倾向高分作品) 默认过滤05年以前的作品, 候选集条目评分数量超过1000" />;
    case "p":
      return <TooltipComponent text="根据你最近看过/玩过的作品进行推荐, 基于条目转移分数, 候选集是几乎所有带有rank的作品" />;
    case "trans":
      return <TooltipComponent text="寻找从目标条目跳转到下一条目最多的条目, 基于条目转移分数" />;
    case "pop":
      return <TooltipComponent text="返回最近一段时间的热门作品, 随机采样10000个活跃用户计算" />;
    case "s":
      return <TooltipComponent text="标记该标签的人数要>=10, 被该标签标记过的作品要>=10" />;
    case "sarsrec":
      return <TooltipComponent text="模型是SASRec, 默认时间区间05年-20年, 候选集条目评分数量超过500" />;
    case "bsr":
      return <TooltipComponent text="模型是BSR, Attention机制的变体" />;
    case "HT":
      return <TooltipComponent text="混合模型, 不同的条目类型使用不同的模型, 候选集条目排除了冷门作品" />;
      
    default:
      return null;
  }
}

const RecommendationContainer = () => {
  const { combinedKeys, redirectUriAuth, recommendations, selectedRecommendation, setRecommendation, setSelectedRecommendation } = useContext(AppContext);

  const handleBangumiLogin = () => {
    const clientId = 'bgm276564fc2e63a9d1a'; // 从 Bangumi 网站获得的客户端 ID
    const redirectUri = encodeURIComponent(redirectUriAuth); // 需要和在 Bangumi 注册应用时填写的 redirect_uri 一致
    const responseType = 'code';
    const state = Math.random().toString(36).substring(7) + Date.now().toString(36); // 示例

    const authUrl = `https://bgm.tv/oauth/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&state=${state}`;

    // 重定向用户到 Bangumi 的 OAuth 授权页面
    window.location.href = authUrl;
  };


  const [showOptions, setShowOptions] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const toggleOptions = () => {
    setShowOptions(prev => !prev);
    setIsButtonClicked(prev => !prev); // 切换按钮点击状态
  }
  const [model, setModel] = useState("p");

  const handleOptionClick = (key) => {
    setSelectedRecommendation(key);
    setRecommendation(key);
    setModel(key);
    setShowOptions(false);  // 关闭下拉框    
    setIsButtonClicked(false); // 切换按钮点击状态
  }

  const dropdownRef = useRef(null);
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowOptions(false);
      setIsButtonClicked(false); // 切换按钮点击状态
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // 清除事件监听器，以防止内存泄漏
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  return (
    <div className='rec'>
      <div className="recommendation-container">
        <div className="custom-dropdown" ref={dropdownRef}>

          {/* 注意这里我们给按钮添加了一个样式flex-container来设置flex布局，使得内容和下拉图标在同一行 */}
          <button
            onClick={() => {
              setRecommendation(model);
              setSelectedRecommendation(model);
            }}
            style={{
              backgroundColor: combinedKeys.includes(selectedRecommendation) ? '#f8f9fa' : '#e8e8e8',
              display: 'flex', alignItems: 'center',
              borderBottomLeftRadius: isButtonClicked ? '0px' : '24px',
              borderBottomRightRadius: isButtonClicked ? '0px' : '24px',
              borderTopLeftRadius: isButtonClicked ? '12px' : '24px',
              borderTopRightRadius: isButtonClicked ? '12px' : '24px',

              border: isButtonClicked ? '1px solid #dfe1e5' : 'none',
            }}
          >
            <_Tooltip x={model} />
            {/* {selectedRec ? selectedRec.name : recommendations.find(rec => ["p"].includes(model)).name} */}
            {recommendations.find(rec => rec.key === model).name}
            {/* 下拉图标 */}
            <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '10px' }} onClick={toggleOptions} />
          </button>

          {showOptions && (
            <ul>
              {recommendations.filter(rec => combinedKeys.includes(rec.key)).map((rec, index, array) => (
                <li
                  key={rec.key}
                  onClick={() => handleOptionClick(rec.key)}
                  className={index === array.length - 1 ? 'rounded-bottom-corners' : ''}
                >
                  {rec.name}
                </li>
              ))}            </ul>
          )}
        </div>


        {recommendations.filter(rec => !combinedKeys.includes(rec.key)).map((rec) => (
          <button
            key={rec.key}
            onClick={() => {
              setRecommendation(rec.key);
              setSelectedRecommendation(rec.key);
            }}
            style={{ backgroundColor: selectedRecommendation === rec.key ? '#f8f9fa' : '#e8e8e8' }}
          >
            <_Tooltip x={rec.key} />
            {rec.name}
          </button>
        ))}

        {/* {combinedKeys.includes(selectedRecommendation) && ( <div>
    <button onClick={handleBangumiLogin}>关联 bangumi 账号</button>
  </div>)} */}


      </div>
    </div>
  );
}

export default RecommendationContainer;
