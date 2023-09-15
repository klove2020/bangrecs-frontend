import React, { useState } from 'react';
import { Button, Drawer, List, ListItem } from 'antd';

const Header = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const page2url = {
    "主页":"/bgmrec",
    '更新说明':"/bgmrec/update",
    '关于网站':"/bgmrec/about",
    '致谢列表':"/bgmrec/thank",
  }

  return (
    <div className='header-container'>
      <div className="header">
        <Button className='menu-button' onClick={showDrawer}>
          {/* 打开侧边栏  */}
        </Button>
        <span>
        Bangrecs
        </span>
        <Drawer
          title="侧边栏"
          placement="left"
          closable={true}
          onClose={onClose}
          visible={visible}
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
