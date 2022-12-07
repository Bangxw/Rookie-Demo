import React from 'react';
import { connect } from 'react-redux'
import { Button, Form, DatePicker, InputNumber, Select, Card, Input } from 'antd';

import { RenderSubtype } from '@components'
import { set_app_spinning, get_ledger_list } from '@redux/actions'
import { ICON_FONT as IconFont, PAY_WAY_LIST } from '@/const'

const ControlPanelForm = props => {
  const [form] = Form.useForm();

  const addNewRecord = () => {
    let formFields = form.getFieldsValue()

    props.set_app_spinning(true)
    fetch('http://127.0.0.1:8800/ledger/bill_list/insert', {
      method: 'POST',
      body: JSON.stringify({
        date: new Date(formFields.date).getTime(),
        amount: parseFloat(formFields.amount),
        subtype_id: props.ledgerSubTypes[formFields.subtype]._id,
        payway: formFields.payway,
        description: formFields.description,
      })
    }).then(response => response.json())
      .then(response => {
        props.get_ledger_list().then(() => {
          form.setFieldsValue({ amount: '', date: '', subtype: '', payway: '', description: '' })
          props.set_app_spinning(false)
        })
      });
  };

  return (
    <Card type="inner" bordered={false} className='mb-4'>
      <Form form={form} name="basic" layout="inline" autoComplete="off" onFinish={addNewRecord}>
        <Form.Item name="date" rules={[{ required: true, message: 'Required Date!' }]}>
          <DatePicker style={{ width: 140, }} placeholder="日期" />
        </Form.Item>

        <Form.Item name="amount" rules={[{ required: true, message: 'Required Amount!' }]} >
          <InputNumber style={{ width: 140, }} placeholder="金额" />
        </Form.Item>

        <Form.Item name="subtype" rules={[{ required: true, message: 'Required Subtypes!' }]}>
          <Select style={{ width: 200, }} placeholder="消费类型" className='font-13'>
            {
              props.ledgerSubTypes.map((_, i) => (
                <Select.Option key={i} className="font-13">
                  <RenderSubtype subtype={_} category={props.ledgerCategory.find(item => item._id === _.categoryID)} />
                </Select.Option>)
              )
            }
          </Select>
        </Form.Item>

        <Form.Item name="payway" rules={[{ required: true, message: 'Required Payway!' }]}>
          <Select style={{ width: 140, }} placeholder="支付途径" className='font-13'>
            {
              PAY_WAY_LIST.map((item, index) => <Select.Option value={item.key} key={index}>{item.label}</Select.Option>)
            }
          </Select>
        </Form.Item>

        <Form.Item name="description">
          <Input placeholder="备注" className='font-13' />
        </Form.Item>

        <Form.Item className='mt-2'>
          <Button type="primary" htmlType="submit">记一笔</Button>
        </Form.Item>

        <Form.Item className='mt-2'>
          <Button type="primary" onClick={() => props.onShowMultiRecordsModal(true)} icon={<IconFont type="icon-edit" style={{ fontSize: '16px' }} />}>点我，新增多条</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default connect(
  state => ({
    ledgerCategory: state.ledgerCategory,
    ledgerSubTypes: state.ledgerSubTypes
  }),
  { set_app_spinning, get_ledger_list }
)(ControlPanelForm);