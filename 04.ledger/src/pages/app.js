import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { Layout, Menu, Spin, ConfigProvider, Row, Col } from 'antd';

import ControlPanelForm from './control_panel.form'
import AddMultipleModal from './add_multiple.modal'
import CategorySubtypesManage from './category_subtypes_manage'
import LedgerListTable from './ledger_list.table'
import { get_ledger_category, get_ledger_subtypes, get_ledger_list, set_app_spinning } from '@redux/actions'
import { MENU_ITEMS } from '@/const'
import zhCN from 'antd/es/locale/zh_CN';

let hasInitData = false; // 控制初始化只请求一次数据

const App = props => {
  const [showAddMultiModal, setShowAddMultiModal] = useState(false);
  const [menuKey, setMenuKey] = useState(localStorage.getItem('defaultSelectedKeys') || 'list')

  useEffect(() => {
    if (!hasInitData) {
      hasInitData = true;
      props.set_app_spinning(true)
      Promise.all([props.get_ledger_category(), props.get_ledger_subtypes(), props.get_ledger_list()]).then(() => {
        props.set_app_spinning(false)
      })
    }
  });

  const handleMenuSelect = (key) => {
    setMenuKey(key);
    localStorage.setItem('defaultSelectedKeys', key)
  }

  return (
    <ConfigProvider locale={zhCN}>
      <Spin tip="Loading..." spinning={props.appSpinning}>
        <Layout>
          <Layout.Header className='mb-4'>
            <Menu items={MENU_ITEMS} mode="horizontal" defaultSelectedKeys={menuKey} onSelect={e => handleMenuSelect(e.key)} />
          </Layout.Header>
          <Layout.Content className='container font-14'>
            {
              menuKey === 'list' && <Row>
                <Col span={18}><LedgerListTable onShowMultiRecordsModal={value => setShowAddMultiModal(value)} /></Col>
                <Col offset={1} span={5}><ControlPanelForm /></Col>
              </Row>
            }
            {
              menuKey === 'manage' ? <CategorySubtypesManage /> : ''
            }
          </Layout.Content>
        </Layout>

        <AddMultipleModal
          showAddMultiModal={showAddMultiModal}
          onShowAddMultiModal={value => setShowAddMultiModal(value)}
        />
      </Spin>
    </ConfigProvider>
  );
};

export default connect(
  state => ({
    ledgerList: state.ledgerList,
    appSpinning: state.appSpinning,
  }),
  { get_ledger_category, get_ledger_subtypes, get_ledger_list, set_app_spinning }
)(App);