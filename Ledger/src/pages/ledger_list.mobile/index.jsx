/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { FloatingBubble } from 'antd-mobile';

import Header from './header';
import LedgerList from './list';
import AddLedgerItem from './add';

function App() {
  const [currentSubtype, setCurrentSubtype] = useState();
  const [visibleAddPopup, setVisibleAddPopup] = useState(false); // 记一笔控件

  return (
    <>
      {/* 列表展示页面头部 */}
      <Header currentSubtype={currentSubtype} setCurrentSubtype={setCurrentSubtype} />

      <main>
        {/* 列表展示 */}
        <LedgerList />

        {/* 新增一笔记录 */}
        <AddLedgerItem visibleAddPopup={visibleAddPopup} setVisibleAddPopup={setVisibleAddPopup} />

        {/* 新增浮动气泡按钮 */}
        <FloatingBubble
          axis="xy"
          magnetic="x"
          onClick={() => { setVisibleAddPopup(true); }}
          style={{
            '--initial-position-bottom': '100px',
            '--initial-position-right': '24px',
            '--edge-distance': '24px',
          }}
        >
          记一笔
        </FloatingBubble>
      </main>
    </>
  );
}

export default App;
