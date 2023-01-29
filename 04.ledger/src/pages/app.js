import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Layout, Spin, ConfigProvider} from 'antd';

import {
  get_ledger_category, get_ledger_subtypes, get_ledger_list, set_app_spinning,
} from '@redux/actions';
import zhCN from 'antd/es/locale/zh_CN';
import AddMultipleModal from './add_multiple.modal';
import CategorySubtypesManage from './category_subtypes_manage';
import LedgerListTable from './ledger_list.table';

let hasInitData = false; // 控制初始化只请求一次数据

function App(props) {
  const [showAddMultiModal, setShowAddMultiModal] = useState(false);
  const [showSubtypeManageModal, setShowSubtypeManageModal] = useState(false);

  useEffect(() => {
    if (!hasInitData) {
      hasInitData = true;
      props.set_app_spinning(true);
      Promise.all([props.get_ledger_category(), props.get_ledger_subtypes(), props.get_ledger_list()]).then(() => {
        props.set_app_spinning(false);
      });
    }
  });

  return (
    <ConfigProvider locale={zhCN}>
      <Spin tip="Loading..." spinning={props.appSpinning}>
        <Layout>
          <Layout.Content className="container font-14 py-4">
            <LedgerListTable
              onShowAddMultiModal={(value) => setShowAddMultiModal(value)}
              onShowSubtypeManageModal={(value) => setShowSubtypeManageModal(value)}
            />
          </Layout.Content>
        </Layout>
      </Spin>

      <AddMultipleModal
        showAddMultiModal={showAddMultiModal}
        onShowAddMultiModal={(value) => setShowAddMultiModal(value)}
      />

      <CategorySubtypesManage
        showSubtypeManageModal={showSubtypeManageModal}
        onShowSubtypeManageModal={(value) => setShowSubtypeManageModal(value)}
      />
    </ConfigProvider>
  );
}

export default connect((state) => ({
  ledgerList: state.ledgerList,
  appSpinning: state.appSpinning,
}), {
  get_ledger_category, get_ledger_subtypes, get_ledger_list, set_app_spinning,
})(App);
