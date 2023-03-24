import React from 'react';
import { connect } from 'react-redux';
import * as dayjs from 'dayjs';
import * as actions from '@redux/actions';
import {
  List, SwipeAction, Dialog, Toast,
} from 'antd-mobile';
import { Avatar } from 'antd';
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
    <>
      {
        dateList.map((date) => (
          <List header={dayjs(parseInt(date, 10)).format('YYYY-MM-DD')} className="m-2" key={date}>
            {
              groupedLedgerBilllist[date].map((item, index) => (
                <SwipeAction key={`${item + index}`} rightActions={rightActions} onAction={() => { schemaKey = item.key; }}>
                  <List.Item
                    prefix={(
                      <Avatar
                        size={48}
                        icon={(
                          <IconFont
                            type={
                              ledgerSubtypes.find((_) => _.key === item.subtype)?.icon
                            }
                          />
                        )}
                        style={{ backgroundColor: '#1DA57A', verticalAlign: 'middle', fontSize: '32px' }}
                      />
                    )}
                    description={`${item.payway}支付`}
                  >
                    <div className="space-between-flex">
                      <span>
                        {
                          ledgerSubtypes.find((_) => _.key === item.subtype)?.text
                        }
                      </span>
                      <span>
                        {`￥${item.amount}`}
                      </span>
                    </div>
                  </List.Item>
                </SwipeAction>
              ))
            }
          </List>
        ))
      }
    </>
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
