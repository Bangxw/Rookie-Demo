import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  Modal, Input, Spin, Button, Form, Space, DatePicker, InputNumber, Select, message,
} from 'antd';
import * as actions from '@redux/actions';
import { PAY_WAY_LIST } from '@src/const';
import { fetch_plus } from '@utils/common';
import { RenderSubtypesByCategory } from '@components/render_subtype';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ledgerCategoryProptypes,
  ledgerSubtypesProptypes,
} from '@utils/proptypes.config';

// 新增分类模态框
function LedgerAddModal({
  ledgerCategory,
  ledgerSubtypes,
  fetch_ledger_billlist_data,
  showBilllistAddModal,
  handle_show_billlist_add_modal,
}) {
  const [form] = Form.useForm();
  const [showSpinning, setShowSpinning] = useState(false);

  const handleOkSubmit = async () => {
    const formFields = await form.validateFields();
    let formData = formFields.billlist;
    if (Array.isArray(formData)) {
      formData = formData.map((item) => ({
        ...item,
        amount: parseFloat(item.amount),
      }));
    }
    setShowSpinning(true);

    fetch_plus('/ledger/billlist', {
      method: 'POST',
      body: JSON.stringify(formData[0]),
    })
      .then((response) => {
        fetch_ledger_billlist_data().then(() => {
          setShowSpinning(false);
          handle_show_billlist_add_modal(false);
          message.success(response.message);
        });
      });
  };

  return (
    <Modal
      title="新增消费记录"
      width="750px"
      open={showBilllistAddModal}
      onOk={handleOkSubmit}
      onCancel={() => handle_show_billlist_add_modal(false)}
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
                    wrap
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
                      name={[name, 'subtype']}
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
                          <Select.Option value={item.value} key={item.value}>
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
  ...ledgerCategoryProptypes,
  ...ledgerSubtypesProptypes,
};
export default connect(
  (state) => ({
    ledgerCategory: state.ledgerCategory,
    ledgerSubtypes: state.ledgerSubtypes,
    showBilllistAddModal: state.showBilllistAddModal,
  }),
  {
    fetch_ledger_billlist_data: actions.fetch_ledger_billlist_data,
    handle_show_billlist_add_modal: actions.handle_show_billlist_add_modal,
  },
)(LedgerAddModal);
