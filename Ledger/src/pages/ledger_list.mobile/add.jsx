import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Popup, NumberKeyboard, Tag, Calendar, Form, Selector, Toast,
} from 'antd-mobile';
import * as actions from '@redux/actions';
import { fetch_plus } from '@utils/common';
import { PAY_WAY_LIST } from '@src/const';
import { ledgerSubtypesProptypes } from '@utils/proptypes.config';
// import dayjs from 'dayjs';

function App({
  ledgerSubtypes,
  fetch_ledger_billlist_data,
  visibleAddPopup,
  setVisibleAddPopup,
}) {
  const initAddSchema = { // 初始数据对象
    date: new Date(),
    payway: [PAY_WAY_LIST[0]],
    amount: [],
    subtype: ledgerSubtypes[0]?.key,
    description: '',
  };
  const [showCalendar, setShowCalendar] = useState(false);
  const [addSchema, setAddSchema] = useState(initAddSchema);

  const numberKeyBoardInput = (key) => {
    // 限制重复输入小数点
    if (key === '.' && addSchema.amount.indexOf('.') > -1) return;
    setAddSchema({ ...addSchema, amount: [...addSchema.amount, key] });
  };

  const handleOkSubmit = async () => {
    const amount = parseFloat(addSchema.amount.join(''));
    if (!amount) {
      Toast.show({ content: '请输入具体金额' });
      return;
    }

    fetch_plus('/ledger/billlist', {
      method: 'POST',
      body: JSON.stringify({
        ...addSchema,
        date: new Date(addSchema.date).getTime(), // 把时间精确到天
        amount,
      }),
    })
      .then(() => {
        fetch_ledger_billlist_data().then(() => {
          Toast.show({
            icon: 'success',
            content: '保存成功',
          });
        });
      });
  };

  const popupClose = () => {
    setVisibleAddPopup(false);
    setAddSchema(initAddSchema);
  };

  return (
    <>
      <Popup
        showCloseButton
        visible={visibleAddPopup}
        onClose={popupClose}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          minHeight: '70vh',
        }}
      >
        <Form layout="horizontal" className="mt-5">
          <Form.Item>
            <div className="p-4" style={{ maxHeight: '20vh', overflowY: 'auto' }}>
              {
                ledgerSubtypes.map((item) => (
                  <Tag
                    round
                    color={addSchema.subtype === item.key ? '#123456' : '#ccc'}
                    className="p-3 m-2"
                    key={item.key}
                    onClick={() => setAddSchema({ ...addSchema, subtype: item.key })}
                  >
                    {item.text}
                  </Tag>
                ))
              }
            </div>
          </Form.Item>
          <Form.Item label="日期">
            <div onClick={() => setShowCalendar(true)} aria-hidden="true">
              {(new Date(addSchema.date)).toLocaleDateString()}
            </div>
          </Form.Item>
          <Form.Item label="支付方式">
            <Selector
              value={addSchema.payway}
              options={PAY_WAY_LIST}
              onChange={(e) => setAddSchema({ ...addSchema, payway: e.join('') })}
            />
          </Form.Item>
          <Form.Item label="金额">
            <div>{addSchema.amount.join('')}</div>
          </Form.Item>
        </Form>
        <NumberKeyboard
          visible
          customKey="."
          confirmText="确定"
          getContainer={null}
          showCloseButton={false}
          onInput={numberKeyBoardInput}
          onConfirm={handleOkSubmit}
          onDelete={() => setAddSchema({ ...addSchema, amount: addSchema.amount.slice(0, -1) })}
        />
      </Popup>
      <Popup
        visible={showCalendar}
        bodyStyle={{ height: '52vh' }}
        onMaskClick={() => {
          setShowCalendar(false);
        }}
      >
        <div style={{ padding: '24px' }}>
          <Calendar
            selectionMode="single"
            // renderLabel={(date) => {
            //   if (dayjs(date).isSame(today, 'day')) return '今天';
            //   if (date.getDay() === 0 || date.getDay() === 6) {
            //     return '周末';
            //   }
            // }}
            onChange={(val) => {
              setAddSchema({ ...addSchema, date: val });
              setShowCalendar(false);
            }}
          />
        </div>
      </Popup>
    </>
  );
}

App.propTypes = { // 使用prop-type进行类型检查
  ...ledgerSubtypesProptypes,
  fetch_ledger_billlist_data: PropTypes.func.isRequired,
  visibleAddPopup: PropTypes.bool.isRequired,
  setVisibleAddPopup: PropTypes.func.isRequired,
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
)(App);
