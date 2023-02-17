import React, { useState } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import {
  Modal, Input, Spin, Button, Form, Space, DatePicker, InputNumber, Select, message,
} from 'antd';
import * as actions from '@redux/actions';
import { FETCH_URL, PAY_WAY_LIST } from '@src/const';
import { RenderSubtypesByCategory } from '@components/render_subtype';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

// 新增分类模态框
function LedgerAddModal({
  ledgerCategory,
  ledgerSubtypes,
  showLedgerAddModal,
  setShowLedgerAddModal,
  fetch_ledger_billlist_data,
}) {
  const [form] = Form.useForm();
  const [showSpinning, setShowSpinning] = useState(false);

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
    fetch(`${FETCH_URL}/ledger/billlist/insert`, {
      method: 'POST',
      body: JSON.stringify(formData),
    }).then((response) => response.json())
      .then((response) => {
        fetch_ledger_billlist_data().then(() => {
          setShowSpinning(false);
          message.success(response.message);
          setShowLedgerAddModal(false);
        });
      });
  };

  return (
    <Modal
      title="新增消费记录"
      width="750px"
      open={showLedgerAddModal}
      onOk={handleOkSubmit}
      onCancel={() => setShowLedgerAddModal(false)}
    >
      <Spin tip="Loading..." spinning={showSpinning}>
        <Form name="dynamic_form_nest_item" autoComplete="off" form={form}>
          {/* Form.List initialValue初始化渲染就展示一项 */}
          <Form.List name="billlist" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <Space
                    key={key}
                    style={{ display: 'flex' }}
                    align="baseline"
                  >
                    <Form.Item
                      name={[name, 'date']}
                      className="my-1"
                      rules={[{ message: 'Required!', required: true }]}
                    >
                      <DatePicker placeholder="日期" style={{ width: '110px' }} />
                    </Form.Item>

                    <Form.Item
                      name={[name, 'amount']}
                      className="my-1"
                      rules={[{ message: 'Required!', required: true }]}
                    >
                      <InputNumber placeholder="金额" style={{ width: '100px' }} />
                    </Form.Item>

                    <Form.Item
                      width="100px"
                      name={[name, 'subtype_id']}
                      className="my-1"
                      rules={[{ message: 'Required!', required: true }]}
                    >
                      <RenderSubtypesByCategory
                        ledgerCategory={ledgerCategory}
                        ledgerSubtypes={ledgerSubtypes}
                      />
                    </Form.Item>

                    <Form.Item
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

                    <Form.Item className="my-1" name={[name, 'description']}>
                      <Input placeholder="备注" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}

                <Form.Item className="mt-2">
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
LedgerAddModal.propTypes = {
  ledgerCategory: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  ledgerSubtypes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      categoryID: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  showLedgerAddModal: PropTypes.bool.isRequired,
  setShowLedgerAddModal: PropTypes.func.isRequired,
  fetch_ledger_billlist_data: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    ledgerCategory: state.ledgerCategory,
    ledgerSubtypes: state.ledgerSubtypes,
  }),
  { fetch_ledger_billlist_data: actions.fetch_ledger_billlist_data },
)(LedgerAddModal);
