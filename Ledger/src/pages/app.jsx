import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ConfigProvider, Spin } from 'antd';
import { PropTypes } from 'prop-types';
import { BrowserView, MobileView } from 'react-device-detect';
import * as actions from '@redux/actions';
import { TabBar } from 'antd-mobile';
import IconFont from '@components/iconfont';

import LedgerList from '@pages/ledger_list';
import LedgerListAdd from '@pages/ledger_list/add';
import LedgerCategorySubtypes from '@pages/ledger_category_subtypes';
import LedgerListMobile from '@pages/ledger_list.mobile';

let hasInitData = false; // 控制初始化只请求一次数据
const mobileTabs = [{
  icon: <IconFont type="icon-details" />,
  label: '明细',
  key: 'list',
}, {
  icon: <IconFont type="icon-statistics" />,
  label: '统计',
  key: 'statistics',
}];

function App({
  appSpinning,
  handle_app_spinning,
  fetch_ledger_category_data,
  fetch_ledger_subtypes_data,
  fetch_ledger_billlist_data,
}) {
  const [activeBar, setActiveBar] = useState(mobileTabs[0].key);

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
      <BrowserView>
        <Spin spinning={appSpinning}>
          <LedgerList />
        </Spin>

        <LedgerListAdd />
        <LedgerCategorySubtypes />
      </BrowserView>

      <MobileView>
        <main>
          {activeBar === 'list' && <LedgerListMobile />}
          {activeBar === 'statistics' && <>111</>}
        </main>

        <div className="mb-tab-bar">
          <TabBar onChange={setActiveBar}>
            {mobileTabs.map((item) => (
              <TabBar.Item key={item.key} icon={item.icon} title={item.label} />
            ))}
          </TabBar>
        </div>
      </MobileView>
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
