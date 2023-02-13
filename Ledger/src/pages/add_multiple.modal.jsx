import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  Modal,
  Input,
  Spin,
  Button,
  Divider,
  Form,
  Space,
  DatePicker,
  InputNumber,
  Select,
  message,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import RenderSubtype from '@components';
import { get_ledger_list } from '@redux/actions';
import { PAY_WAY_LIST } from '@/const';

function meraged_subtype_by_category(data) {
  const categorySubtypes = {};
  data.forEach((item) => {
    if (!categorySubtypes[item.categoryID]) categorySubtypes[item.categoryID] = [];
    categorySubtypes[item.categoryID].push(item);
  });
  return categorySubtypes;
}

function AddMultipleModal(props) {
  const {
    ledgerCategory,
    ledgerSubTypes,
    onShowAddMultiModal,
    showAddMultiModal,
    get_ledger_list: get_ledger_list_data,
  } = props;
  const mergedSubtypes = meraged_subtype_by_category(ledgerSubTypes);
  const [showSpinning, setShowSpinning] = useState(false);
  const [form] = Form.useForm();

  const handleOkSubmit = async () => {
    const formFields = await form.validateFields();
    let formData = formFields.billlist;
    if (Array.isArray(formData)) {
      formData = formData.map((item) => ({
        ...item,
        date: new Date(item.date.format('YYYY-MM-DD')).getTime(), // 把时间精确到天
        amount: parseFloat(item.amount),
      }));
    }
    setShowSpinning(true);
    fetch('http://127.0.0.1:8800/ledger/bill_list/insert', {
      method: 'POST',
      body: JSON.stringify(formData),
    }).then((response) => response.json())
      .then((response) => {
        get_ledger_list_data().then(() => {
          setShowSpinning(false);
          message.success(response.message);
          onShowAddMultiModal(false);
        });
      });
  };

  const handleModalCancel = () => {
    onShowAddMultiModal(false);
  };

  return (
    <Modal
      title="新增消费记录"
      width="650px"
      open={showAddMultiModal}
      onOk={handleOkSubmit}
      onCancel={handleModalCancel}
    >
      <Spin tip="Loading..." spinning={showSpinning}>
        <Form name="dynamic_form_nest_item" autoComplete="off" form={form}>
          {/* Form.List initialValue初始化渲染就展示一项 */}
          <Form.List name="billlist" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: 'flex' }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'date']}
                      className="my-1"
                      rules={[{ message: 'Required!', required: true }]}
                    >
                      <DatePicker placeholder="日期" style={{ width: '110px' }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'amount']}
                      className="my-1"
                      rules={[{ message: 'Required!', required: true }]}
                    >
                      <InputNumber placeholder="金额" style={{ width: '70px' }} />
                    </Form.Item>
                    <Form.Item
                      width="100px"
                      {...restField}
                      name={[name, 'subtype_id']}
                      className="my-1"
                      rules={[{ message: 'Required!', required: true }]}
                    >
                      <Select placeholder="消费类型" style={{ width: '140px' }}>
                        {Object.keys(mergedSubtypes).map((record) => (
                          <Select.OptGroup
                            key={record}
                            label={(
                              <Divider orientation="left" plain className="m-0">
                                { ledgerCategory.find((item) => item.key === record)?.text }
                              </Divider>
                            )}
                          >
                            {
                              mergedSubtypes[record].map((_) => (
                                <Select.Option key={_.key} className="font-12">
                                  <RenderSubtype subtype={_} />
                                </Select.Option>
                              ))
                            }
                          </Select.OptGroup>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'payway']}
                      className="my-1"
                      rules={[{ message: 'Required!', required: true }]}
                    >
                      <Select placeholder="支付途径" style={{ width: '100px' }}>
                        {PAY_WAY_LIST.map((item) => (
                          <Select.Option value={item.key} key={item.key}>
                            {item.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item {...restField} className="my-1" name={[name, 'description']}>
                      <Input placeholder="备注" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Spin>
    </Modal>
  );
}

export default connect(
  (state) => ({
    ledgerCategory: state.ledgerCategory,
    ledgerSubTypes: state.ledgerSubTypes,
  }),
  { get_ledger_list },
)(AddMultipleModal);
