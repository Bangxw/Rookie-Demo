import { Card, Spin, Layout, Menu, Button } from 'antd';
import React, { useState, useEffect, useMemo, memo } from 'react';

// import ControlPanelForm from '@components/control_panel.form'
// import AddMultipleModal from '@components/add_multiple.modal'
// import LedgerTagsManageModal from '@components/ledger_tags_manage.modal'
// import LedgerListTable from '@components/ledger_list.table'

const App = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [ledgerSubTypes, setLedgerTags] = useState([]);
  const [ledgerList, setLedgerList] = useState([]);
  const [showAddMultiModal, setShowAddMultiModal] = useState(false);

  const [menuKey, setMenuKey] = useState('list')

  const get_ledger_list = () => {
    fetch('http://127.0.0.1:8800/ledger/bill_list')
      .then(response => response.json())
      .then(response => {
        response.data.map(item => item.key = item._id)
        setLedgerList(response.data || [])
      });
  }

  const get_ledger_subtypes = () => {
    fetch('http://127.0.0.1:8800/ledger/sub_types')
      .then(response => response.json())
      .then(response => {
        response.data.map(item => item.key = item._id)
        setLedgerTags(response.data || [])
      });
  }

  const get_ledger_category = () => {
    fetch('http://127.0.0.1:8800/ledger/category')
      .then(response => response.json())
      .then(response => {
        response.data.map(item => item.key = item._id)
        // setLedgerTags(response.data || [])
      });
  }

  useEffect(() => {
    // get_ledger_subtypes()
    // get_ledger_list()
  }, []);

  const items = [
    { label: '列表', key: 'list' }, // 菜单项务必填写 key
    { label: '消费类型管理', key: 'manage' },
  ];

  return (
    <>
      <Layout style={{ background: 'transparent' }}>
        <Layout.Header className='header'>
          {/* <Menu items={items} mode="horizontal" onSelect={e => setMenuKey(e.key)} /> */}
        </Layout.Header>
        <Layout.Content>
          <div className='container'>
            {/* {
              menuKey === 'list' ? (
                <>
                  <Card type="inner" style={{ marginBottom: 20 }} className="new-record-control">
                    <ControlPanelForm
                      ledgerSubTypes={ledgerSubTypes}
                      onRefreshData={() => get_ledger_list()}
                      onShowMultiRecordsModal={value => setShowAddMultiModal(value)}
                    />
                  </Card>
                  <LedgerListTable ledgerSubTypes={ledgerSubTypes} ledgerList={ledgerList} onRefreshData={() => get_ledger_list()} />
                </>
              ) : ''
            }

            {
              menuKey === 'manage' ? (
                <LedgerTagsManageModal
                  isSpinning={isSpinning}
                  onIsSpinning={value => setIsSpinning(value)}
                  ledgerSubTypes={ledgerSubTypes}
                  onRefreshledgerSubTypes={() => get_ledger_subtypes()}
                />
              ) : ''
            } */}
          </div>
        </Layout.Content>
      </Layout>

      {/* <AddMultipleModal
        ledgerSubTypes={ledgerSubTypes}
        showAddMultiModal={showAddMultiModal}
        onShowAddMultiModal={value => setShowAddMultiModal(value)}
      /> */}
    </>
  );
};

export default memo(App);