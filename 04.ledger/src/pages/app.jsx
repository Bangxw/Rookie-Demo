import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Layout, Spin, ConfigProvider } from 'antd';
import {
  get_ledger_category, get_ledger_subtypes, get_ledger_list, handle_app_spinning,
} from '@redux/actions';
import zhCN from 'antd/es/locale/zh_CN';
import AddMultipleModal from './add_multiple.modal';
import CategorySubtypesManage from './category_subtypes_manage';
import LedgerListTable from './ledger_list.table';

let hasInitData = false; // 控制初始化只请求一次数据

function App(props) {
  const [showAddMultiModal, setShowAddMultiModal] = useState(true); // 是否展示添加多行记录的模态框
  const [showSubtypeManageModal, setShowSubtypeManageModal] = useState(false); // 是否展示类型管理的模态框
  const {
    handle_app_spinning: handle_app_spingning_status, // 控制spinning展示
    get_ledger_category: get_ledger_category_data,
    get_ledger_subtypes: get_ledger_subtypes_data,
    get_ledger_list: get_ledger_list_data,
    appSpinning,
  } = props;

  useEffect(() => {
    if (!hasInitData) {
      hasInitData = true;
      handle_app_spingning_status(true);
      Promise.all([
        get_ledger_category_data(),
        get_ledger_subtypes_data(),
        get_ledger_list_data(),
      ]).then(() => {
        handle_app_spingning_status(false);
      });
    }
  });

  return (
    <ConfigProvider locale={zhCN}>
      <Spin tip="Loading..." spinning={appSpinning}>
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
  get_ledger_category, get_ledger_subtypes, get_ledger_list, handle_app_spinning,
})(App);
