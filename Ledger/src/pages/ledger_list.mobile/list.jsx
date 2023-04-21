import React from 'react';
import { connect } from 'react-redux';
import * as dayjs from 'dayjs';
import * as actions from '@redux/actions';
import {
  SwipeAction, Dialog, Toast, Card,
} from 'antd-mobile';
// import { Avatar } from 'antd';
import { fetch_plus } from '@utils/common';
import {
  ledgerCategoryProptypes,
  ledgerSubtypesProptypes,
  ledgerBilllistProptypes,
} from '@utils/proptypes.config';
import PropTypes from 'prop-types';
import IconFont from '@components/iconfont';

// 按日期分组
function grouped_data_by_date(data) {
  return data.sort((a, b) => b.date - a.date).reduce((acc, item) => {
    if (acc[item.date]) acc[item.date].push(item);
    else acc[item.date] = [item];
    return acc;
  }, []);
}

function LedgerList({
  ledgerSubtypes,
  ledgerBilllist,
  fetch_ledger_billlist_data,
}) {
  let schemaKey = -1; // 当前操作行的key
  const groupedLedgerBilllist = grouped_data_by_date(ledgerBilllist); // 按日期分组后的数据集合
  const dateList = Object.keys(groupedLedgerBilllist); // 日期列表（groupedLedgerBilllist keys)
  const rightActions = [{
    key: 'unsubscribe',
    text: '修改分类',
    color: 'light',
  }, {
    key: 'delete',
    text: '删除',
    color: 'danger',
    onClick: async () => {
      const confirm = await Dialog.confirm({
        content: '确定要删除吗？',
      });
      if (confirm) {
        fetch_plus(`/ledger/billlist/${schemaKey}`, {
          method: 'DELETE',
        })
          .then(() => {
            fetch_ledger_billlist_data().then(() => {
              Toast.show({
                icon: 'success',
                content: '删除成功',
              });
            });
          });
      }
    },
  }];

  return (
    <div className="p-2">
      {
        dateList.map((date) => (
          <Card
            key={date}
            title={(
              <div style={{ fontWeight: 'normal' }}>
                {dayjs(parseInt(date, 10)).format('YYYY-MM-DD')}
              </div>
            )}
            headerStyle={{ border: 'none', background: '#fbfbfb' }}
            className="mb-2 mobile-ledger-list"
          >
            {
              groupedLedgerBilllist[date].map((item, index) => (
                <SwipeAction key={`${item + index}`} rightActions={rightActions} onAction={() => { schemaKey = item.key; }}>
                  <div className="ledger-grid-item">
                    <div className="mt-3 subtype-icon">
                      <IconFont type={ledgerSubtypes.find((_) => _.key === item.subtype)?.icon} />
                    </div>
                    <div className={`py-3 ${index > 0 && 'border-top-1'}`}>
                      <div className="space-between-flex">
                        <span className="font-14">{ledgerSubtypes.find((_) => _.key === item.subtype)?.text}</span>
                        <span>{`￥ -${item.amount}`}</span>
                      </div>
                      <span className="font-12" style={{ color: '#afafaf' }}>{`${item.payway}支付`}</span>
                    </div>
                  </div>
                </SwipeAction>
              ))
            }
          </Card>
        ))
      }
    </div>
  );
}

LedgerList.propTypes = { // 使用prop-type进行类型检查
  ...ledgerCategoryProptypes,
  ...ledgerSubtypesProptypes,
  ...ledgerBilllistProptypes,
  fetch_ledger_billlist_data: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    ledgerCategory: state.ledgerCategory,
    ledgerSubtypes: state.ledgerSubtypes,
    ledgerBilllist: state.ledgerBilllist,
  }),
  {
    fetch_ledger_billlist_data: actions.fetch_ledger_billlist_data,
  },
)(LedgerList);
