import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Popup, NumberKeyboard, Calendar, Selector, Toast, Divider, TextArea, Button,
} from 'antd-mobile';
import * as actions from '@redux/actions';
import { fetch_plus } from '@utils/common';
import { PAY_WAY_LIST } from '@src/const';
import { ledgerSubtypesProptypes } from '@utils/proptypes.config';
import IconFont from '@components/iconfont';
import dayjs from 'dayjs';

function Add({
  ledgerSubtypes,
  fetch_ledger_billlist_data,
  visibleAddPopup,
  setVisibleAddPopup,
}) {
  const initAddSchema = { // 初始数据对象
    date: new Date(),
    payway: PAY_WAY_LIST[0].value,
    subtype: ledgerSubtypes[0]?.key,
    description: '',
    amount: [],
  };
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);
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
        subtype: addSchema.subtype ? addSchema.subtype : ledgerSubtypes[0]?.key,
        date: dayjs(addSchema.date).valueOf(),
        amount,
      }),
    }).then(() => {
      fetch_ledger_billlist_data().then(() => {
        Toast.show({
          icon: 'success',
          content: '保存成功',
        });
      });
    });
  };

  return (
    <>
      <Popup
        showCloseButton
        visible={visibleAddPopup}
        onClose={() => { setVisibleAddPopup(false); setAddSchema(initAddSchema); }}
        bodyStyle={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', minHeight: '460px' }}
      >
        <div className="p-4 mobile-ledger-add-wrap">
          <div id="payway_calendar_fields" className="space-between-flex mt-5">
            <Selector
              value={addSchema.payway}
              options={PAY_WAY_LIST}
              onChange={(e) => setAddSchema({ ...addSchema, payway: e.join('') })}
              style={{
                '--padding': '5px 10px',
                '--gap-horizontal': '5px',
              }}
            />
            <div className="calendar-control" onClick={() => setShowCalendar(true)} aria-hidden="true">
              {(new Date(addSchema.date)).toLocaleDateString()}
            </div>
          </div>
          <Divider className="my-3" />
          <div id="subtype_fields">
            {
              ledgerSubtypes.map((item) => (
                <div
                  key={item.key}
                  aria-hidden="true"
                  className={`subtype my-2 ${(addSchema.subtype || ledgerSubtypes[0].key) === item.key ? 'active' : ''}`}
                  onClick={() => setAddSchema({ ...addSchema, subtype: item.key })}
                >
                  <div className="subtype-icon"><IconFont type={item.icon} /></div>
                  <div className="subtype-text font-12">{item.text}</div>
                </div>
              ))
            }
            <div className="subtype">
              <div className="subtype-icon">...</div>
              <div className="subtype-text font-12">分类管理</div>
            </div>
          </div>
          <Divider className="my-3" />
          <div id="amount_description_fields" className="space-between-flex">
            <div className="add-amount">
              <strong>￥</strong>
              {addSchema.amount.join('')}
            </div>
            <span
              className="add-description-link"
              aria-hidden="true"
              onClick={() => { setShowDescriptionPopup(true); }}
            >
              添加备注
            </span>
          </div>
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
        </div>
      </Popup>

      {/* 日历 */}
      <Popup
        visible={showCalendar}
        bodyStyle={{ height: '420px' }}
        onMaskClick={() => { setShowCalendar(false); }}
      >
        <div className="p-4">
          <Calendar
            selectionMode="single"
            onChange={(val) => {
              setAddSchema({ ...addSchema, date: val });
              setShowCalendar(false);
            }}
          />
        </div>
      </Popup>

      {/* 添加备注 */}
      <Popup
        visible={showDescriptionPopup}
        bodyStyle={{ height: '240px' }}
        onMaskClick={() => { setShowDescriptionPopup(false); }}
        className="add-description-popup"
      >
        <header className="pt-2 px-2">
          <span aria-hidden="true" onClick={() => setShowDescriptionPopup(false)}>&lt;</span>
          添加备注
        </header>
        <div className="px-4 pt-5">
          <TextArea
            autoFocus
            showCount
            maxLength={30}
            onChange={(e) => setAddSchema({ ...addSchema, description: e })}
          />
          <div className="mt-4 button-wrap"><Button color="primary" block onClick={() => setShowDescriptionPopup(false)}>确定</Button></div>
        </div>
      </Popup>
    </>
  );
}
Add.propTypes = { // 使用prop-type进行类型检查
  ...ledgerSubtypesProptypes,
  fetch_ledger_billlist_data: PropTypes.func.isRequired,
  visibleAddPopup: PropTypes.bool.isRequired,
  setVisibleAddPopup: PropTypes.func.isRequired,
};
export default connect(
  (state) => ({ ledgerSubtypes: state.ledgerSubtypes }),
  { fetch_ledger_billlist_data: actions.fetch_ledger_billlist_data },
)(Add);
