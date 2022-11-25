import React from 'react';
import { connect } from 'react-redux'
import { Button, Form, DatePicker, InputNumber, Select, Tag, Card } from 'antd';

import { set_app_spinning, get_ledger_list } from '@redux/actions'
import { ICON_FONT as IconFont } from '@/const'


const ControlPanelForm = props => {
  const [form] = Form.useForm();

  const add_new_record = () => {
    let formFields = form.getFieldsValue()
    console.log(form, formFields)
    debugger

    props.set_app_spinning(true)
    fetch('http://127.0.0.1:8800/ledger/bill_list/insert_one', {
      method: 'POST',
      body: JSON.stringify({
        date: formFields.date.toString(),
        amount: formFields.amount,
        subtype_id: props.ledgerSubTypes[formFields.subtype]._id,
        payway: formFields.payway,
      })
    })
      .then(data => {
        props.get_ledger_list().then(() => {
          form.setFieldsValue({ amount: '', date: '', subtype: [''], payway: [''] })
          props.set_app_spinning(false)
        })
      });
  };

  return (
    <Card type="inner" bordered={false} className='mb-4'>
      <Form form={form} name="basic" layout="inline" autoComplete="off" onFinish={add_new_record}>
        <Form.Item name="date" rules={[{ required: true, message: 'Required Date!' }]}>
          <DatePicker style={{ width: 150, }} placeholder="日期" />
        </Form.Item>

        <Form.Item name="amount" rules={[{ required: true, message: 'Required Amount!' }]} >
          <InputNumber
            style={{ width: 150, }}
            placeholder="金额"
          />
        </Form.Item>

        <Form.Item name="subtype" rules={[{ required: true, message: 'Required Subtypes!' }]}>
          <Select style={{ width: 150, }} placeholder="消费类型">
            {
              props.ledgerSubTypes.map((_, i) => <Select.Option key={i}>{<IconFont type={_.icon} style={{ fontSize: '18px' }} />}&nbsp;<Tag>{_.text}</Tag></Select.Option>)
            }
          </Select>
        </Form.Item>

        <Form.Item name="payway" rules={[{ required: true, message: 'Required Payway!' }]}>
          <Select style={{ width: 150, }} placeholder="支付途径">
            <Select.Option value='支付宝'>支付宝</Select.Option>
            <Select.Option value='微信'>微信</Select.Option>
            <Select.Option value='招商信用卡'>招商信用卡</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24, }} >
          <Button type="primary"  htmlType="submit">记一笔</Button>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24, }} >
          <Button type="primary" onClick={() => props.onShowMultiRecordsModal(true)} icon={<IconFont type="icon-edit" style={{ fontSize: '16px' }} />}>点我，新增多条</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default connect(
  state => ({ ledgerSubTypes: state.ledgerSubTypes }),
  { set_app_spinning, get_ledger_list }
)(ControlPanelForm);