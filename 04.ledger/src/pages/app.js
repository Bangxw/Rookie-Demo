import { connect } from 'react-redux'
import { Card, Layout, Menu, Spin } from 'antd';
import React, { useState, useEffect, memo } from 'react';

import { get_ledger_category } from '../redux/actions'

import ControlPanelForm from '@components/control_panel.form'
import AddMultipleModal from '@components/add_multiple.modal'
import LedgerTagsManageModal from '@components/ledger_tags_manage.modal'
import LedgerListTable from '@components/ledger_list.table'

import { ORIGIN_CATEGORY, ORIGIN_SUBTYPES } from '@/const'

const defaultSelectedKeys = localStorage.getItem('defaultSelectedKeys') || 'list'
const MENU_ITEMS = [
  { label: '列表', key: 'list' }, // 菜单项务必填写 key
  { label: '消费类型管理', key: 'manage' },
];

const App = props => {
  const [appSpinning, setAppSpinning] = useState(false);
  const [ledgerCategory, setLedgerCategory] = useState([]);
  const [ledgerSubTypes, setLedgerTypes] = useState([]);
  const [ledgerList, setLedgerList] = useState([]);
  const [showAddMultiModal, setShowAddMultiModal] = useState(false);

  const [menuKey, setMenuKey] = useState(defaultSelectedKeys)



  const get_ledger_subtypes = async () => {
    return fetch('http://127.0.0.1:8800/ledger/sub_types')
      .then(response => response.json())
      .then(response => {
        response.data.map(item => item.key = item._id)
        setLedgerTypes(response.data || [])
      }).catch(() => {
        setLedgerTypes(ORIGIN_SUBTYPES)
      })
  }

  const get_ledger_list = async () => {
    return fetch('http://127.0.0.1:8800/ledger/bill_list')
      .then(response => response.json())
      .then(response => {
        response.data.map(item => item.key = item._id)
        setLedgerList(response.data || [])
      }).catch(() => {
        setLedgerTypes(ORIGIN_SUBTYPES)
      })
  }

  const handleMenuSelect = (key) => {
    setMenuKey(key);
    localStorage.setItem('defaultSelectedKeys', key)

    props.get_ledger_category()
  }

  useEffect(() => {
    // setAppSpinning(true)
    // Promise.all([get_ledger_category(), get_ledger_subtypes(), get_ledger_list()]).then(function () {
    //   setAppSpinning(false)
    // })
  }, []);


  return (
    <Spin tip="Loading..." spinning={appSpinning}>
      <Layout>
        <Layout.Header className='mb-4'>
          <Menu items={MENU_ITEMS} mode="horizontal" defaultSelectedKeys={defaultSelectedKeys} onSelect={e => handleMenuSelect(e.key)} />
        </Layout.Header>
        <Layout.Content>
          <div className='container'>
            {
              menuKey === 'list' ? (
                <>
                  <Card type="inner" bordered={false} className='mb-4'>
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

            {/* {
              menuKey === 'manage' ? (
                <LedgerTagsManageModal
                  ledgerCategory={ledgerCategory}
                  ledgerSubTypes={ledgerSubTypes}
                  onRefreshledgerCategory={() => get_ledger_category()}
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
    </Spin>
  );
};

export default connect(
  state => ({ ledgerCategory: state }),
  { get_ledger_category }
)(App);