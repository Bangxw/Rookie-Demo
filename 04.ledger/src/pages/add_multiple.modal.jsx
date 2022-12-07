import React, { useState, useRef } from 'react';
import { connect } from 'react-redux'
import { Modal, Input, List, Spin, Drawer, Button, Divider, message, Tag } from 'antd';

import { get_ledger_list } from '@redux/actions'
import { ICON_FONT as IconFont, PAY_WAY_LIST } from '@/const'


const AddMultipleModal = props => {
  const multiRecordsRef = useRef(null);
  const [multiRecords, setMultiRecords] = useState('')
  const [showSpinning, setShowSpinning] = useState(false);
  const [showDrawer, setShowshowDrawer] = useState(true);
  const [errorMessages, setErrorMessages] = useState('');

  const handleChange = e => {
    setMultiRecords(e.target.value)
  }

  const handleOkSubmit = e => {
    const insetData = []
    setErrorMessages('')
    try {
      if (multiRecords.replace(/\s/g, '') === '') throw new Error(`请至少输入一组数据`)
      let arrMutiRecords = multiRecords.split('\n')
      if (Array.isArray(arrMutiRecords)) {
        arrMutiRecords.forEach((rowItem, index) => {
          const arrRowItem = rowItem.split(' ')
          if (arrRowItem.length < 4) throw new Error(`第${index + 1}行数据校验出错，请检查是否有多的空格、多输入或少输入数据`)

          const [date, subtype, payway, amount, description] = arrRowItem
          if ((new Date(date)).toString() === 'Invalid Date') throw new Error(`第${index + 1}行数据检验出错，请检查时间格式`)

          let subtypeID = null;
          props.ledgerSubTypes.forEach(item => {
            if (item.text.includes(subtype)) subtypeID = item._id;
          })
          if (!subtypeID) throw new Error(`第${index + 1}行数据-类别校验异常，请输入预定义的类别`)

          let strPayway = null
          PAY_WAY_LIST.forEach((item, index) => {
            if (item.label.includes(payway)) strPayway = item.key;
          })
          if (!strPayway) throw new Error(`第${index + 1}行数据-支付途径校验异常，请输入预定义的支付途径`)

          // eslint-disable-next-line eqeqeq
          if (parseFloat(amount) != amount) throw new Error(`第${index + 1}行数据-金额校验异常，金额只支持数字和小数点`)

          insetData.push({
            date: new Date(date).getTime(),
            amount: parseFloat(amount),
            subtype_id: subtypeID,
            payway: strPayway,
            description
          })
        })
      }
    } catch (error) {
      multiRecordsRef.current?.focus();
      setErrorMessages(error.toString())
      return;
    }

    setShowSpinning(true)
    fetch('http://127.0.0.1:8800/ledger/bill_list/insert', {
      method: 'POST',
      body: JSON.stringify(insetData)
    }).then(response => response.json())
      .then(response => {
        props.get_ledger_list().then(() => {
          setShowSpinning(false)
          message.success(response.message);
          props.onShowAddMultiModal(false)
        })
      });
  }

  const handleModalCancel = () => {
    setShowshowDrawer(true)
    props.onShowAddMultiModal(false);
    setErrorMessages('');
    setMultiRecords('');
  }

  return (
    <>
      <Modal title="新增多条" open={props.showAddMultiModal}
        onOk={handleOkSubmit}
        onCancel={handleModalCancel}
      >
        <Spin tip="Loading..." spinning={showSpinning}>
          <Input.TextArea rows={5} style={{ resize: 'none' }} ref={multiRecordsRef} value={multiRecords} onChange={handleChange} />
          <div className="text-danger font-12 mt-2">{errorMessages}</div>
        </Spin>
      </Modal>

      <Drawer placement="left" mask={false}
        title={<IconFont type='icon-help' className="font-24 text-purple" />}
        closable={false}
        open={props.showAddMultiModal && showDrawer}
        extra={<Button type="primary" danger onClick={() => setShowshowDrawer(false)}>Close</Button>}
      >
        <div className='multi-records-desc font-13'>
          <p>示例：每组数据之间用空格分隔，分别表示<strong className='text-purple'>日期、消费类别、支付途径和金额</strong></p>
          <p className='p-2 my-4 borderd'>
            <small>2022-11-20 外卖/快餐 支付宝 8.88</small><br />
            <small>2022-11-21 3C 微信 0.55</small><br />
            <small>2022-11-22 衣服 信用卡 500</small><br />
            <small>...</small>
          </p>
          <Divider orientation="left" style={{ fontSize: '12px', color: '#00f' }}>其中支付途径如下：</Divider>
          <p className='mb-4 pl-4'>
            {PAY_WAY_LIST.map((item, index) => <code key={index} className="mr-2">{item.label}</code>)}
          </p>
          <Divider orientation="left" style={{ fontSize: '12px', color: '#00f' }}>消费类别分类如下：</Divider>
          {
            <List size="small" bordered dataSource={props.ledgerCategory} renderItem={(_, i) => (
              <List.Item className='font-13'>
                {
                  <div>
                    <strong className='user-select-none mr-2'>{_.text}: </strong>
                    {props.ledgerSubTypes.filter(item => item.categoryID === _._id).map((item, index) => <Tag key={index} className='my-1'>{item.text}</Tag>)}
                  </div>
                }
              </List.Item>
            )} />
          }
        </div>
      </Drawer>
    </>
  );
};

export default connect(
  state => ({
    ledgerSubTypes: state.ledgerSubTypes,
    ledgerCategory: state.ledgerCategory,
  }),
  { get_ledger_list }
)(AddMultipleModal);