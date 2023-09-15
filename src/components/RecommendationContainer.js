import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';







const RecommendationContainer = () => 
{
const {redirectUriAuth, recommendations, selectedRecommendation, setRecommendation, setSelectedRecommendation} = useContext(AppContext);

const handleBangumiLogin = () => {
  const clientId = 'bgm276564fc2e63a9d1a'; // 从 Bangumi 网站获得的客户端 ID
  // const redirectUri = encodeURIComponent('https://bangrecs.net/bgmrec/oauth/callback'); // 需要和在 Bangumi 注册应用时填写的 redirect_uri 一致
  const redirectUri = encodeURIComponent(redirectUriAuth); // 需要和在 Bangumi 注册应用时填写的 redirect_uri 一致
  const responseType = 'code';
  const state =  Math.random().toString(36).substring(7) + Date.now().toString(36); // 示例
  
  const authUrl = `https://bgm.tv/oauth/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&state=${state}`;
  
  // 重定向用户到 Bangumi 的 OAuth 授权页面
  window.location.href = authUrl;
};

return(
  <div className="recommendation-container">
    {recommendations.map((rec) => (
      <button
        key={rec.key}
        onClick={() => {
          setRecommendation(rec.key);
          setSelectedRecommendation(rec.key);
        }}
        style={{ backgroundColor: selectedRecommendation === rec.key ? '#e8e8e8' : '#f8f9fa' }}
      >
        {rec.name}
      </button>
    ))}
  {selectedRecommendation == 'p' && ( <div>
    <button onClick={handleBangumiLogin}>关联 bangumi 账号</button>
  </div>)}

  </div>


);
    }
export default RecommendationContainer;
