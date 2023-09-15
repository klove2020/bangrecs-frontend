import './App.css';
import './css/main.css'
import 'react-datepicker/dist/react-datepicker.css';


import React, { useEffect, useContext } from 'react';
import AppContext from './contexts/AppContext';
import RecommendationContainer from './components/RecommendationContainer';
import SearchLine from './components/SearchLine';
import FilterContainer from './components/filtercontainer/FilterContainer';
import DataContainer from './components/datacontainer/DataContainer';
import { AppProvider } from './contexts/AppContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {AboutPage, ThankPage, UpdatePage} from './components/header/MdPage'; // 引入About组件

import Header from './components/header/Header'; // 引入Header组件


function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>  );

}

const AppContent = () => {
  const {redirectUriAuth, uid, setUid,data, setData, filter, recommendation, selectedRecommendation, domain,startDate,endDate } = useContext(AppContext);

  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentUtoken = urlParams.get('utoken');
  
    // 从 localStorage 中获取已存储的 utoken
    const storedUtoken = localStorage.getItem('utoken');
  
    // 检查 utoken 是否有变化
    if (currentUtoken && currentUtoken !== storedUtoken) {
      // 更新 localStorage
      localStorage.setItem('utoken', currentUtoken);
  
      // 发起新的请求
      fetch(`https://bangrecs.net/api/utoken2uid?utoken=${currentUtoken}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'bangrecs',
        },
      })
      .then(response => response.json())
      .then(data => {
        const uid = data.uid;
        setUid(uid);
        // console.log(`test utoken 2 uid${uid}`);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }, [setUid]);
  
    


  useEffect(() => {
    // 初始化或当 selectedRecommendation 更改时，更新 data
    const storedData = localStorage.getItem(`data:${selectedRecommendation}`);
    setData(storedData ? JSON.parse(storedData) : []);

    const storeUid = localStorage.getItem(`uid:${selectedRecommendation}`);
    setUid(storeUid ? storeUid:"")
  }, [selectedRecommendation]);

  useEffect(() => {
    localStorage.setItem(`uid:${selectedRecommendation}`, uid);
    localStorage.setItem(`data:${selectedRecommendation}`, JSON.stringify(data));
    localStorage.setItem('filter', filter);
    localStorage.setItem('recommendation', recommendation);
    localStorage.setItem('selectedRecommendation', selectedRecommendation);
    localStorage.setItem('domain', domain);
    localStorage.setItem('startDate', startDate);
    localStorage.setItem('endDate', endDate);    
  }, [uid, data, filter, recommendation, selectedRecommendation, domain, startDate, endDate]);

return (
  <div>
    <Header />
    <Routes>
      <Route path="/bgmrec/about" element={<AboutPage />} />
      <Route path="/bgmrec/update" element={<UpdatePage />} />
      <Route path="/bgmrec/thank" element={<ThankPage />} />
      <Route path="/bgmrec" element={
        <div className="app-container">
          <RecommendationContainer />
          <SearchLine />
          <FilterContainer />
          <DataContainer />
        </div>
      } />
    </Routes>
  </div>
);
};



export default App;
