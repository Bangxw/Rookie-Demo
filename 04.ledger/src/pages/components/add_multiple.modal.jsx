import React, { useState, useRef } from 'react';
import { connect } from 'react-redux'
import { Modal, Input, List, Popover, Spin } from 'antd';

import { ICON_FONT as IconFont } from '@/const'

const AddMultipleModal = props => {
  const multiRecordsRef = useRef(null);
  const [multiRecords, setMultiRecords] = useState('')
  const [showSpinning, setShowSpinning] = useState(false);
  const [errorMessages, setErrorMessages] = useState('');

  const poroverNode = <List
    size="small"
    bordered
    dataSource={props.ledgerSubTypes}
    renderItem={(item, index) =>
      <List.Item style={{ fontSize: '12px' }}>
        {`${index} => `}{item.category} - <IconFont type={item.icon} style={{ fontSize: '16px' }} />{item.text}
      </List.Item>
    }
  />

  const handleChange = e => {
    setMultiRecords(e.target.value)
  }

  const handleOkSubmit = e => {
    const insetData = []
    setErrorMessages('')
    try {
      if (multiRecords.replace(/\s/g, '') === '') throw `请至少输入一组数据`
      let arrMutiRecords = multiRecords.split('\n')
      if (Array.isArray(arrMutiRecords)) {
        arrMutiRecords.forEach((rowItem, index) => {
          const arrRowItem = rowItem.split(' ')
          if (arrRowItem.length !== 4) throw `第${index + 1}行数据校验出错，请检查是否有多的空格、多输入或少输入数据`

          const [date, subtypeIndex, payway, amount] = arrRowItem
          if ((new Date(date)).toString() === 'Invalid Date') throw `第${index + 1}行数据检验出错，请检查时间格式`

          let subtypeID = null;
          props.ledgerSubTypes.forEach((item, index) => {
            if (index === parseInt(subtypeIndex)) subtypeID = item._id;
          })
          if (!subtypeID) throw `第${index + 1}行数据-类别校验异常，请输入预定义的类别`

          let strPayway = ['支付宝', '微信', '招商信用卡'][payway]
          if (!strPayway) throw `第${index + 1}行数据-支付途径校验异常，请输入预定义的支付途径`

          if (parseFloat(amount) != amount) throw `第${index + 1}行数据-金额校验异常，金额只支持数字和小数点`

          insetData.push({
            date: new Date(date),
            amount: amount,
            subtype_id: subtypeID,
            payway: strPayway,
          })
        })
      }
    } catch (error) {
      multiRecordsRef.current?.focus();
      setErrorMessages(error.toString())
      return;
    }

    setShowSpinning(true)
    fetch('http://127.0.0.1:8800/ledger/bill_list/insert_many', {
      method: 'POST',
      body: JSON.stringify(insetData)
    }).then(data => {
      props.get_ledger_list().then(() => {
        setShowSpinning(false)
      })
    });

    props.onShowAddMultiModal(false)
  }

  const handleModalCancel = () => {
    props.onShowAddMultiModal(false);
    setErrorMessages('');
    setMultiRecords('');
  }

  return (
    <Modal title="新增多条" open={props.showAddMultiModal}
      onOk={handleOkSubmit}
      onCancel={handleModalCancel}
    >
      <Spin tip="Loading..." spinning={showSpinning}>
        <div className='multi-records-desc'>
          <strong>示例：</strong>
          <p style={{ border: '1px dashed #ccc', padding: '5px', marginTop: '8px' }}>
            <small>2022-11-21 1 0 8.88</small><br />
            <small>2022-11-21 1 1 500</small><br />
            <small>...</small>
          </p>
          <p>
            <small>用空格分隔，分别表示日期、类别、支付途径（0:微信 1:支付宝 2:招商信用卡）和金额，其中类别分类如下：</small>
            <Popover content={poroverNode} title="Category-Subtypes">
              <IconFont type='icon-help' style={{ fontSize: '16px', color: '#f00' }} />
            </Popover>
          </p>
        </div>
        <Input.TextArea rows={5} style={{ resize: 'none' }} ref={multiRecordsRef} value={multiRecords} onChange={handleChange} />
        <div className="text-danger font-12 mt-2">{errorMessages}</div>
      </Spin>
    </Modal>
  );
};

export default connect(
  state => ({ ledgerSubTypes: state.ledgerSubTypes }),
)(AddMultipleModal);