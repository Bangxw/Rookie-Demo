import React from 'react';
import { connect } from 'react-redux'
import { Button, Form, DatePicker, InputNumber, Select, Card, Input, Col, Row } from 'antd';

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
      <Form name="basic" autoComplete="off"
        form={form}
        labelCol={{ span: 6, }}
        wrapperCol={{ span: 18, }}
        onFinish={addNewRecord}
      >
        <Form.Item name="date" label="日期" rules={[{ required: true, message: 'Required Date!' }]}>
          <DatePicker placeholder="日期" className="width-100" />
        </Form.Item>

        <Form.Item name="amount" label="金额" rules={[{ required: true, message: 'Required Amount!' }]} >
          <InputNumber placeholder="金额" className="width-100" />
        </Form.Item>

        <Form.Item name="subtype" label="类型" rules={[{ required: true, message: 'Required Subtypes!' }]}>
          <Select placeholder="消费类型">
            {
              props.ledgerSubTypes.map((_, i) => (
                <Select.Option key={i} className="font-12">
                  <RenderSubtype subtype={_} category={props.ledgerCategory.find(item => item._id === _.categoryID)} />
                </Select.Option>)
              )
            }
          </Select>
        </Form.Item>

        <Form.Item name="payway" label="途径" rules={[{ required: true, message: 'Required Payway!' }]}>
          <Select placeholder="支付途径" className='font-13'>
            {
              PAY_WAY_LIST.map((item, index) => <Select.Option value={item.key} key={index}>{item.label}</Select.Option>)
            }
          </Select>
        </Form.Item>

        <Form.Item name="description" label="备注">
          <Input placeholder="备注" />
        </Form.Item>

        <Row>
          <Col span={24}><Button type="primary" className='width-100 mb-2' htmlType="submit">记一笔</Button></Col>
          <Col span={24}><Button type="primary" className="width-100" onClick={() => props.onShowMultiRecordsModal(true)}><IconFont type="icon-edit" style={{ fontSize: '16px' }} />新增多条</Button></Col>
        </Row>
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