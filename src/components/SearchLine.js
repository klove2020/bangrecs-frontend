import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../contexts/AppContext';

import Select from 'react-select';


const SearchLine = () => {
    const { setIsRealTimeUpdate,setIsDateFilterEnabled, options, customStyles, uid, setUid, fetchData, setShowFilterTool, filter, setFilter, showFilterTool, selectedRecommendation, isLoading, setData, setStartDate, setEndDate} = useContext(AppContext);
    
    const [inputvalue, setInputvalue] = useState('');
    
    const handleQuery = () => {
        setData([]);
        fetchData().then( () =>{
            setIsRealTimeUpdate(false);
            setStartDate(new Date(1900, 0, 1));
            setEndDate(new Date());
            setIsDateFilterEnabled(false);    
    });
    };

    useEffect(() => {

        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                handleQuery();
            }
        };

        window.addEventListener('keypress', handleKeyPress);
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, [setData, fetchData, setStartDate, setEndDate]); // 包括所有相关的依赖项
    
    useEffect(() => {
        switch(selectedRecommendation){
            case "s":
                setShowFilterTool(true);
                setInputvalue('');
                break;
            case "pop":
                setShowFilterTool(true);
                setInputvalue('');
                break;
            case "p":
                setShowFilterTool(true);
                setInputvalue(uid);
                break;
            case "p_dev":
                setShowFilterTool(true);
                setInputvalue(uid);
                break;
                default:
                setShowFilterTool(false);
        }
    }, [selectedRecommendation, setShowFilterTool, setUid, uid, setInputvalue]);


    const getPlaceholderText = () => {
        switch (selectedRecommendation) {
            case "s":
                return "这里禁止输入";
            case "pop":
                return "这里禁止输入"; // 你可以根据需要替换
            case "p":
                return "关联bangumi账号";
            case "trans":
                return "输入条目id";
            default:
                return null;
        }
    };

    return (
        <div className='searchline'>
            <div className="search-container">
                <Select
                    value={options.find(option => option.value === filter)}
                    onChange={option => setFilter(option.value)}
                    options={options}
                    styles={customStyles}
                />
                <input value={inputvalue} onChange={(e) => {setUid(e.target.value); setInputvalue(e.target.value)}} 
                placeholder={ getPlaceholderText()} 
                
                // disabled = {selectedRecommendation === "pop" || selectedRecommendation === "s"} 
                disabled = {selectedRecommendation != "trans"} 
                    />                
                <button onClick={() => {handleQuery() }}>                    
                    {isLoading ? <div className="loading-icon"></div> : '查询'}
                </button>

                
            </div>
            <button className="menu-button" onClick={() => setShowFilterTool(!showFilterTool)}></button>
        </div>
    );
}
export default SearchLine;