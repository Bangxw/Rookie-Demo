import React from 'react';
import { Card } from 'antd';

import SideBar from './sidebar';
import Ribbon from './ribbon';
import TableDashboard from './table_dashboard';

export default function LedgerList() {
  return (
    <div className="container">
      { /* 左侧导航菜单 */}
      <SideBar />

      <Card
        type="inner"
        className="mb-4"
        style={{ minHeight: '300px' }}
      >
        { /* 按键功能区 */}
        <Ribbon />
        { /* 数据展示区 */}
        <TableDashboard />
      </Card>
    </div>
  );
}
