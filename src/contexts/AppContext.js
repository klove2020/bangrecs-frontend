import React, { createContext, useState } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const recommendations = [
    { key: 'p', name: '推荐作品' },
    // { key: 'p_dev', name: '个性化推荐(dev)' },
    { key: 'MF', name: '推荐作品(MF)' },
    { key: 'sarsrec', name: '推荐作品(SAS)' },
    // { key: 'pop', name: '流行作品' },
    { key: 'bsr', name: '推荐作品(BSR)' },
    
    // { key: 'cp', name: '对话式推荐' },    
    { key: 'trans', name: '条目转移' },
    { key: 's', name: '标签搜索' },
    
    
  ];

  const combinedKeys = ['p', "sarsrec", 'MF', "pop", 'bsr'];
  

  const [resultCount, setResultCount] = useState(10);

  const [popdays, setPopdays] = useState(7);

  const [tagGroups, setTagGroups] = useState([[]]);

  const [filter, setFilter] = useState(localStorage.getItem('filter') || '0');
  const [recommendation, setRecommendation] = useState(localStorage.getItem('recommendation') || 'p');
  const [selectedRecommendation, setSelectedRecommendation] = useState(localStorage.getItem('selectedRecommendation') || 'p');
  const [data, setData] = useState(JSON.parse(localStorage.getItem(`data:${selectedRecommendation}`)) || []);
  const [uid, setUid] = useState(localStorage.getItem(`uid:${selectedRecommendation}`) || '');
  const initStartDate = localStorage.getItem('startDate') ? new Date(localStorage.getItem('startDate')) : new Date(1900, 0, 1);
  const initEndDate = localStorage.getItem('endDate') ? new Date(localStorage.getItem('endDate')) : new Date();

  const [relationList, setRelationList] = useState(
    JSON.parse(localStorage.getItem('relationList')) || []
  );
  

  const [startDate, setStartDate] = useState(initStartDate);
  const [endDate, setEndDate] = useState(initEndDate);

  const [domain, setDomain] = useState(localStorage.getItem("domain") || "bgm.tv");

  const [tags, setTags] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [dislikeLoading, setDislikeLoading] = useState(false);


  const [currentPage, setCurrentPage] = useState(0);

  const [isRealTimeUpdate, setIsRealTimeUpdate] = useState(false);

  const redirectUriAuth = "https://bangrecs.net/api/bangumi_oauth/callback"
  // const redirectUriAuth = "http://localhost:3000/bgmrec"

  const [isDateFilterEnabled, setIsDateFilterEnabled] = useState(false);
  const [isTagFilterEnabled, setIsTagFilterEnabled] = useState(false);
  const [showFilterTool, setShowFilterTool] = useState(false);


  const options = [
    { value: '0', label: '全部类型' },
    { value: '1', label: '书籍' },
    { value: '2', label: '动漫' },
    { value: '3', label: '音乐' },
    { value: '4', label: '游戏' },
    { value: '6', label: '三次元' },
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: 'none',
      borderRight: '1px solid #dfe1e5',
      borderRadius: '24px 0 0 24px',
      height: '40px',
      flexGrow: 0,
      flexShrink: 0,
      width: '110px',
      fontSize: "13px"
    }),
  };



  const fetchData = async () => {
    try {
      setIsLoading(true);

      console.log(startDate);
      const requestData = {
        strategy: recommendation,
        type: filter !== 'all' ? filter : "all",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        tags: tagGroups,
        topk: resultCount,
        popdays: popdays,
        update_f: isRealTimeUpdate,
        IsTimeFilter: isDateFilterEnabled,
        IsTagFilter: isTagFilterEnabled,
      };

      const search_button = () => {
        switch (selectedRecommendation) {
          case "p_dev":
            return axios.post(`https://bangrecs.net/api/v4/rec_dev/${uid ? uid : '-1'}/`, requestData);
          case "pop":
            return axios.post(`https://bangrecs.net/api/v4/rec/${uid ? uid : '-1'}/`, requestData);          
          case "trans":
            return axios.post(`https://bangrecs.net/api/v4/trans/${uid ? uid : '-1'}/`, requestData);
          default:
            return axios.post(`https://bangrecs.net/api/v4/rec/${uid ? uid : '-1'}/`, requestData);
        }
      }

      const response = await search_button()

      // const response = await axios.post(`http://localhost:8085/api/v4/rec/${uid ? uid : '-1'}/`, requestData);


      console.log(1)

      const result = response.data;

      


      const detailedData = result.data;
      setData(detailedData);
      console.log(detailedData);      
      const newRelationList = result.relation_list;
      console.log(newRelationList);
      setRelationList(newRelationList); // 更新状态
      localStorage.setItem('relationList', JSON.stringify(newRelationList)); // 更新localStorage      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setCurrentPage(0);
    }
  };


  return (
    <AppContext.Provider value={
      {
        relationList, 
        setRelationList,
        combinedKeys,
        redirectUriAuth,
        dislikeLoading, setDislikeLoading,
        tagGroups, setTagGroups,
        isDateFilterEnabled,
        setIsDateFilterEnabled,
        isTagFilterEnabled,
        setIsTagFilterEnabled,
        popdays,
        domain,
        setDomain,
        setPopdays,
        resultCount,
        setResultCount,
        isRealTimeUpdate,
        setIsRealTimeUpdate,
        isLoading,
        setIsLoading,
        currentPage,
        setCurrentPage,
        uid,
        setUid,
        data,
        setData,
        filter,
        setFilter,
        recommendation,
        setRecommendation,
        selectedRecommendation,
        setSelectedRecommendation,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        tags,
        setTags,
        showFilterTool,
        setShowFilterTool,
        options,
        customStyles,
        recommendations,
        fetchData,
      }
    }>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
