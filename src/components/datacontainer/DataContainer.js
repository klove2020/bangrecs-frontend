import React, { useState, useEffect, useContext, useRef } from 'react';
import AppContext from '../../contexts/AppContext';

import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

// import {SubejctItem} from './subjectitem';
import GroupedSubjectItems from './subjectitem';


import { Select } from 'antd';
const { Option } = Select;


const ITEMS_PER_PAGE = 10;


const DataContainer = () => {
  const { dislikeLoading, data, currentPage, setCurrentPage, domain, setDomain, relationList } = useContext(AppContext);


  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  let currentData = [];

  if (Array.isArray(data) && data.length > 0) {
    currentData = data.slice(startIndex, endIndex);
  }
  

  return dislikeLoading? (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'  // 你可以根据需要调整这个值
  }}>
      <div className="loading-icon"></div>
  </div>
  ) : (
    
    (
    <DndProvider backend={TouchBackend} options={
      { delayTouchStart: 300,
      }}>
    <div className="container">
      <Select
        value={domain}
        style={{ width: 150, right: 0 }}
        onChange={(value) => setDomain(value)}
        defaultValue={"bgm.tv"}
      >
        <Option value="bgm.tv">bgm.tv</Option>
        <Option value="bangumi.tv">bangumi.tv</Option>
        <Option value="chii.in">chii.in</Option>
      </Select>
      {/* 增加域名选择 */}
      {data.message ? (
        <div className="error-message">{data.message}</div>
      ) : (

        // currentData.map(item => (
        //   <SubejctItem key={item.sid} item={item} domain={domain} />
        // ))
        <GroupedSubjectItems items={currentData} relationList={relationList} domain={domain} />
      )}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
          Next
        </button>
      </div>
    </div>
    </DndProvider>))
  ;
};

export default DataContainer;

