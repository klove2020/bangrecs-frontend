import React, { useState, useRef, useContext,useEffect } from 'react';
import AppContext from '../../contexts/AppContext';

import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import axios from 'axios';


import { faChevronDown } from '@fortawesome/free-solid-svg-icons'; // 导入向下的图标

function getTypeExplanation(subject_type) {
    switch (subject_type) {
        case 1:
            return "书籍";
        case 2:
            return "动漫";
        case 3:
            return "音乐";
        case 4:
            return "游戏";
        case 6:
            return "三次元";
        default:
            return "未知类型";
    }
}

function getColorByType(subject_type) {
    switch (subject_type) {
        case 4:
            return "rgba(255, 200, 210, 0.3)"; // 
        case 2:
            return "rgba(173, 216, 233, 0.3)"; // 
        case 3:
            return "rgba(144, 238, 144, 0.2)"; // 音乐 - 浅绿色
        case 6:
            return "rgba(147, 112, 219, 0.2)"; // 三次元
        case 1:
            return "rgba(255, 239, 213, 0.2)"; // 书 - 柔和的黄色
        default:
            return "rgba(255, 255, 255, 0.1)"; // 未知类型 - 白色
    }
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份是从0开始的
    return `${year}-${month}`;
}
const Rating = ({ score }) => {
    const fullStars = Math.floor(score);
    const halfStars = score % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 10 - fullStars - halfStars;

    return (
        <div className="rating">
            {Array(fullStars).fill(null).map((_, index) => (
                <FontAwesomeIcon key={index} icon={solidStar} />
            ))}
            {halfStars ? <FontAwesomeIcon icon={solidStar} /> : null}
            {Array(emptyStars).fill(null).map((_, index) => (
                <FontAwesomeIcon key={index} icon={regularStar} />
            ))}
        </div>
    );
};

const _date_process_func = (date) => {
    const originalDate = new Date(date);
    const formattedDate = `${originalDate.getFullYear()}/${String(originalDate.getMonth() + 1).padStart(2, '0')}/${String(originalDate.getDate()).padStart(2, '0')}`;
    return formattedDate;
}






// const SubejctItem = ({ item, domain }) => {
//     const { selectedRecommendation, uid, fetchData, dislikeLoading, setDislikeLoading } = useContext(AppContext);


//     const handleDislike = () => {
//         setDislikeLoading(true)
//         const url = "https://bangrecs.net/api/dislike";
//         const data_ = {
//             "uid": uid,
//             "sid": item.sid,
//         };

//         axios.post(url, data_)
//             .then(() => {
//                 fetchData().finally(() => {
//                     setDislikeLoading(false);  // 设置 isLoading 为 false，表示请求完成
//                 });
//             })
//             .catch((error) => {
//                 console.error(error);  // 修改 console.error 的调用方式
//             })
//             // .finally(() => {
//             //     setDislikeLoading(false);  // 设置 isLoading 为 false，表示请求完成
//             // })
//             ;
//     };


//     const ref = useRef(null);
//     const [, refDrop] = useDrop({
//         accept: "ITEM",
//     });

//     const [, refDrag] = useDrag({
//         type: "ITEM",
//         item: { item },
//     });

//     // 可以使用touch和mouse拖动
//     refDrop(ref);
//     refDrag(ref);

//     const handleDragEnd = (event) => {
//         const rect = ref.current.getBoundingClientRect();
//         if (event.clientX > window.innerWidth - 100) {
//             console.log("Dropped on the right");
//             // Trigger your function
//         } else if (event.clientX < 100) {
//             console.log("Dropped on the left");
//             // Trigger your function
//         }
//     };

//     return (
//         <div
//             ref={ref}
//             draggable
//             onDragEnd={handleDragEnd}
//             key={item.sid}
//             className="item"
//             onClick={() => {
//                 window.location.href = `https://${domain}/subject/${item.sid}`;
//             }}
//             style={{
//                 position: 'relative',  // 添加这一行来进行子元素的绝对定位
//                 background: getColorByType(item.subject_type)
//             }}
//         >
//             <img src={item.image_medium} alt={item.name} />
//             <div className="item-info">
//                 <h3>{item.name_cn ? item.name_cn : item.name}</h3>
//                 <h4 id='score'>{item.trans_score ? item.trans_score.toFixed(2) : item.pop ? item.pop : 'N/A'}</h4>
//                 <h5>{_date_process_func(item.date)}, &nbsp; 排名:{item.rank !== 0 ? item.rank : 'N/A'},&nbsp; 评分:{item.score}{<Rating score={item.score} />}</h5>
//                 <p>{item.summary ? item.summary : ""}</p>
//             </div>
//             <h4 id='stype'>{getTypeExplanation(item.subject_type)}</h4>

//             {/* 添加不喜欢的按钮 */}
//             {/* {selectedRecommendation == "p" &&
//                 <button
//                     style={{
//                         position: 'absolute',
//                         bottom: '10px',
//                         right: '10px',
//                         background: getColorByType(item.subject_type)
//                         // margintop:"10px",
//                     }}
//                     onClick={(e) => {
//                         e.stopPropagation();  // 阻止冒泡，以避免触发div的onClick事件
//                         handleDislike(item.sid);
//                     }}
//                 >
//                     换一个
//                 </button>} */}
//         </div>


//     );
// };



const SubjectItemContent = ({ item, domain, hovered, setHovered }) => {
    const isHovered = hovered === item.sid;

    const hoverTimer = useRef();

    const handleMouseEnter = () => {
      // 设置延时
      hoverTimer.current = setTimeout(() => {
        setHovered(item.sid);
      }, 600);
    };
  
    const handleMouseLeave = () => {
      // 清除定时器
      clearTimeout(hoverTimer.current);
    };


    return isHovered?(
      <div
        key={item.sid}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`item ${hovered === item.sid ? 'hovered' : ''}`}
        onClick={() => window.location.href = `https://${domain}/subject/${item.sid}`}
        style={{
          position: 'relative',
          background: getColorByType(item.subject_type),
          margin: 0,  
        
        }}
      >
        <img src={item.image_medium} alt={item.name} className="item-image" />
        <div className="item-info">
          <h3>{item.name_cn || item.name}</h3>
          <h4 id="score">{item.trans_score?.toFixed(2) || item.pop || 'N/A'}</h4>
            <h4 id='score'>{item.trans_score ? item.trans_score.toFixed(2) : item.pop ? item.pop : 'N/A'}</h4>
            <h5>{_date_process_func(item.date)}, &nbsp; 
          {item.rank && `排名: ${item.rank}`}, 评分: {<Rating score={item.score}></Rating>}</h5>
          <p>{item.summary}</p>
        </div>
        <h4 id="stype">{getTypeExplanation(item.subject_type)}</h4>
      </div>
    ): (
        // 简略版本
        <div
            key={item.sid}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="item"
            onClick={() => setHovered(item.sid)} // for 移动设备
            style={{
                position: 'relative',
                background: getColorByType(item.subject_type),
                opacity: 0.7,
            
            }}
        >
            {/* <img src={item.image_medium} alt={item.name} className="item-image-small" /> */}
            <div className="item-info-small">
                <h4 style={{fontSize: "9px"}}>{item.name_cn || item.name}({formatDate(item.date)})</h4>
                
                {/* <h4 id="score-small">{item.trans_score?.toFixed(2) || item.pop || 'N/A'}</h4> */}
            </div>
            <h4 id="stype" style={{fontSize: "9px"}}>{getTypeExplanation(item.subject_type)}</h4>
        </div>
    );
  };
  
  const SubjectItem = ({ item, domain, otherItems }) => {
    const { selectedRecommendation, uid, fetchData, dislikeLoading, setDislikeLoading } = useContext(AppContext);
    
    const [hovered, setHovered] = useState(item?.sid);

    useEffect(() => {
        if (item) {
            setHovered(item.sid);
          }
      }, [item]);
    if (!item) {
        return null;
    }

    // setHovered(item.sid)
        
    // ;
    return (
        <div
            style={{
                gap:0,
            }}
        >
            <SubjectItemContent 
                item={item} 
                domain={domain} 
                hovered={hovered} 
                setHovered={setHovered} 
                
            />
            {otherItems && otherItems.map(otherItem => (
                <SubjectItemContent 
                    key={otherItem.sid} 
                    item={otherItem} 
                    domain={domain} 
                    hovered={hovered} 
                    setHovered={setHovered} 
                    // transform= {scale(0.3)}
                    // transition= {transform 0.3s ease}
                />
            ))}
        </div>
    );
};



const GroupedSubjectItems = ({ items, relationList, domain }) => {
    // 创建分组
    console.log("gg");
    
    console.log(items);
    console.log(relationList[0]);

    console.log("gg2");

    const groups = relationList.map(group => ({
        representative: items.find(item => item.sid === group[0]),
        others: group.slice(1).map(sid => items.find(item => item.sid === sid)).filter(item => item !== undefined)
    }));
    console.log(groups);

    return (
        <>
            {groups.map((group, index) => (
                <SubjectItem key={index} item={group.representative} domain={domain} otherItems={group.others} />
            ))}
        </>
    );
};



export default GroupedSubjectItems;
