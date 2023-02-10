import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Layout, Spin, ConfigProvider } from 'antd';
import { PropTypes } from 'prop-types';
import * as actions from '@redux/actions';
import BilllistTable from '@pages/ledger_billlist.table';

let hasInitData = false; // 控制初始化只请求一次数据

function App({
  appSpinning,
  handle_app_spinning,
  fetch_ledger_category_data,
  fetch_ledger_subtypes_data,
  fetch_ledger_billlist_data,
}) {
  // init 请求所有数据
  useEffect(() => {
    if (!hasInitData) {
      hasInitData = true;
      handle_app_spinning(true);
      Promise.all([
        fetch_ledger_category_data(),
        fetch_ledger_subtypes_data(),
        fetch_ledger_billlist_data(),
      ]).then(() => {
        handle_app_spinning(false);
      });
    }
  });

  return (
    <ConfigProvider>
      <Spin spinning={appSpinning}>
        {/* layout布局 */}
        <Layout>
          <Layout.Content className="container font-14 py-4">
            <BilllistTable />
          </Layout.Content>
        </Layout>
      </Spin>
    </ConfigProvider>
  );
}
App.propTypes = { // 使用 PropTypes 进行类型检查
  appSpinning: PropTypes.bool.isRequired,
  handle_app_spinning: PropTypes.func.isRequired,
  fetch_ledger_category_data: PropTypes.func.isRequired,
  fetch_ledger_subtypes_data: PropTypes.func.isRequired,
  fetch_ledger_billlist_data: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({ // state
    appSpinning: state.appSpinning,
  }),
  { // actions
    handle_app_spinning: actions.handle_app_spinning,
    fetch_ledger_category_data: actions.fetch_ledger_category_data,
    fetch_ledger_subtypes_data: actions.fetch_ledger_subtypes_data,
    fetch_ledger_billlist_data: actions.fetch_ledger_billlist_data,
  },
)(App);
