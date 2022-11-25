import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { Layout, Menu, Spin } from 'antd';

import ControlPanelForm from '@components/control_panel.form'
import AddMultipleModal from '@components/add_multiple.modal'
import CategorySubtypesManage from '@components/category_subtypes_manage'
import LedgerListTable from '@components/ledger_list.table'
import { get_ledger_category, get_ledger_subtypes, get_ledger_list, set_app_spinning } from '@redux/actions'
import { MENU_ITEMS } from '@/const'



const App = props => {
  const [showAddMultiModal, setShowAddMultiModal] = useState(false);
  const [menuKey, setMenuKey] = useState(localStorage.getItem('defaultSelectedKeys') || 'list')

  useEffect(() => {
    props.set_app_spinning(true)
    Promise.all([props.get_ledger_category(), props.get_ledger_subtypes(), props.get_ledger_list()]).then(function () {
      props.set_app_spinning(false)
    })
  }, []);

  const handleMenuSelect = (key) => {
    setMenuKey(key);
    localStorage.setItem('defaultSelectedKeys', key)
  }

  return (
    <Spin tip="Loading..." spinning={props.appSpinning}>
      <Layout>
        <Layout.Header className='mb-4'>
          <Menu items={MENU_ITEMS} mode="horizontal" defaultSelectedKeys={menuKey} onSelect={e => handleMenuSelect(e.key)} />
        </Layout.Header>
        <Layout.Content>
          <div className='container'>
            {
              menuKey === 'list' ? (
                <>
                  <ControlPanelForm onShowMultiRecordsModal={value => setShowAddMultiModal(value)} />
                  <LedgerListTable />
                </>
              ) : ''
            }

            {
              menuKey === 'manage' ? <CategorySubtypesManage /> : ''
            }
          </div>
        </Layout.Content>
      </Layout>

      <AddMultipleModal
        showAddMultiModal={showAddMultiModal}
        onShowAddMultiModal={value => setShowAddMultiModal(value)}
      />
    </Spin>
  );
};

export default connect(
  state => ({ appSpinning: state.appSpinning }),
  { get_ledger_category, get_ledger_subtypes, get_ledger_list, set_app_spinning }
)(App);