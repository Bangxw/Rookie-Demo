import { Button, Form, DatePicker, InputNumber, Select, Tag } from 'antd';
import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { ICONFONT_URL } from '../const'

const IconFont = createFromIconfontCN({
  scriptUrl: [ICONFONT_URL],
});

const ControlPanelForm = props => {
  const [form] = Form.useForm();

  const handleClick = (values) => {
    let formFields = form.getFieldsValue()
    fetch('http://127.0.0.1:8800/ledger/list/insert_one', {
      method: 'POST',
      body: JSON.stringify({
        Date: formFields.Date.toString(),
        Amount: formFields.Amount,
        Tags: props.classificationTags[formFields.Tags],
        PayWay: formFields.PayWay,
      })
    })
      .then(response => response.json())
      .then(data => {
        props.onRefreshData()
        form.setFieldsValue({ Amount: '', Date: '', Tags: [''] })
      });
  };

  return (
    <>
      <Form form={form} name="basic" layout="inline">
        <Form.Item name="Date">
          <DatePicker style={{ width: 150, }} placeholder="日期" />
        </Form.Item>

        <Form.Item name="Amount">
          <InputNumber
            style={{ width: 150, }}
            placeholder="金额"
          />
        </Form.Item>

        <Form.Item name="Tags">
          <Select style={{ width: 150, }} placeholder="消费类型">
            {
              props.classificationTags.map((item, index) => <Select.Option key={index}>{<IconFont type={item.icon[1]} style={{ fontSize: '18px' }} />}&nbsp;<Tag color={item.icon[0]}>{item.text}</Tag></Select.Option>)
            }
          </Select>
        </Form.Item>

        <Form.Item name="PayWay">
          <Select style={{ width: 150, }} placeholder="支付途径">
            <Select.Option value='支付宝'>支付宝</Select.Option>
            <Select.Option value='微信'>微信</Select.Option>
            <Select.Option value='招商信用卡'>招商信用卡</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24, }} >
          <Button type="primary" onClick={(e) => handleClick(e)}>新增一条</Button>
        </Form.Item>

        {/* <Form.Item wrapperCol={{ span: 24, }} >
          <Button type="primary" onClick={() => props.onShowMultiRecordsModal(true)} icon={<IconFont type="icon-witty" style={{ fontSize: '20px' }} />}>点我，新增多条</Button>
        </Form.Item> */}

        <Form.Item wrapperCol={{ span: 24, offset: 24 }} >
          <Button type="primary" onClick={() => props.onShowLedgerTagsManageModal(true)}>类型标签管理</Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ControlPanelForm;