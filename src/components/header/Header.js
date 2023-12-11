import React, { useState } from 'react';
import { Button, Drawer, List, ListItem } from 'antd';
import { GithubOutlined, FileTextOutlined } from '@ant-design/icons'; // 引入GitHub图标

const Header = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const page2url = {
    "主页": "/bgmrec",
    '更新说明': "/bgmrec/update",
    '关于网站': "/bgmrec/about",
    // '技术报导': "/bgmrec/report",
  }

  const githubUrl = "https://github.com/klove2020/bangrecs-frontend"; // 设置GitHub仓库链接

  const docUrl = "https://bangrecs.net/api/docs/"

  return (
    <div className='header-container'>
      <div className="header">
        <Button className='menu-button' onClick={showDrawer}>
          {/* 打开侧边栏  */}
        </Button>
        <a href="/bgmrec" style={{ textDecoration: 'none', color: 'inherit' }}>
          Bangrecs
        </a>

        {/* 在这里添加GitHub图标和链接 */}
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <GithubOutlined style={
            {
              fontSize: '24px',
              color: '#333',
              marginLeft: "25px",
              // border: "1px solid #ddd", // 添加边框
              borderRadius: "4px", // 边框圆角
              padding: "5px" // 内部填充              
            }
          } />
          <span>GitHub</span>
        </a>

        {/* 在这里添加文档图标和链接  TODO:还不完善暂时不加 */}
        {/* <a href={docUrl} target="_blank" rel="noopener noreferrer"  style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <FileTextOutlined style={
            {
              fontSize: '24px', 
              color: '#333',
              marginLeft: "25px",
              borderRadius: "4px",
              padding: "5px"
            }
          } />
          <span>API 文档</span>
        </a> */}

        <Drawer
          title="侧边栏"
          placement="left"
          closable={true}
          onClose={onClose}
          visible={visible}
          width={280}
        >
          <List
            dataSource={Object.keys(page2url)}
            renderItem={item => (
              <List.Item>
                <a href={`${page2url[item]}`}>{item}</a>
              </List.Item>
            )}
          />
        </Drawer>
      </div>
    </div>
  );
};

export default Header;
