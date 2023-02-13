import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Spin, ConfigProvider } from 'antd';
import { PropTypes } from 'prop-types';
import * as actions from '@redux/actions';
import BilllistTable from '@pages/ledger_billlist.table';
import CategorySubtypesModal from '@pages/ledger_category_subtypes';

let hasInitData = false; // 控制初始化只请求一次数据

function App({
  appSpinning,
  handle_app_spinning,
  fetch_ledger_category_data,
  fetch_ledger_subtypes_data,
  fetch_ledger_billlist_data,
}) {
  const [showSubtypeManageModal, setShowSubtypeManageModal] = useState(true);
  const [showDashboard, setShowDashboard] = useState(true);

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
        {/* 消费列表 */}
        <main className="container font-14 py-4">
          {/* 书签式菜单 */}
          <div className="bookmarks-menu">
            <ul>
              <li onClick={() => { setShowDashboard(!showDashboard); }} aria-hidden="true">
                Toggle Show
              </li>
              <li onClick={() => { setShowDashboard(!showDashboard); }} aria-hidden="true">
                Subtype Manage
              </li>
            </ul>
          </div>
          <BilllistTable setShowSubtypeManageModal={setShowSubtypeManageModal} />
        </main>

        <CategorySubtypesModal
          showSubtypeManageModal={showSubtypeManageModal}
          onShowSubtypeManageModal={(value) => setShowSubtypeManageModal(value)}
        />
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
