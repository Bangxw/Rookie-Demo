/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Form, Table, Popconfirm, message, DatePicker, InputNumber, Input, Select, Typography,
} from 'antd';
import i18n from '@i18n';
import * as actions from '@redux/actions';
import RenderSubtype, { RenderSubtypesByCategory } from '@components/render_subtype';
import { PAY_WAY_LIST } from '@src/const';
import { fetch_plus, filter_sort_data_by_date_range } from '@utils/common';
import {
  ledgerCategoryProptypes,
  ledgerSubtypesProptypes,
  ledgerBilllistProptypes,
} from '@utils/proptypes.config';

// eslint-disable-next-line no-unused-vars
function RenderSummary({
  ledgerBilllist, datePickerRange,
}) {
  let summary = 0;
  // 过滤在选择的时间内的数据，精度到天（day）
  summary = filter_sort_data_by_date_range(
    ledgerBilllist,
    datePickerRange,
  ).reduce((a, b) => a + b.amount, 0);
  return (
    <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell colSpan={3}>&nbsp;</Table.Summary.Cell>
        <Table.Summary.Cell colSpan={5} className="text-purple">
          ￥
          {summary.toFixed(2)}
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
}

// 渲染列表
function LedgerListTable({
  ledgerBilllist,
  ledgerCategory,
  ledgerSubtypes,
  datePickerRange,
  handle_app_spinning,
  fetch_ledger_billlist_data,
}) {
  const [billlistForm] = Form.useForm();
  const [editingRowKey, setEditingRowKey] = useState(''); // 当前正在编辑行的key值
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // select row key

  // 编辑当前行
  const handleRecordEdit = (record) => {
    setEditingRowKey(record.key);
    billlistForm.setFieldsValue({
      ...record,
      date: dayjs(record.date),
    });
  };

  // 保存编辑的数据
  const handleRecordSave = async (id) => {
    // 等待表单校验并且拿到form fields
    const row = await billlistForm.validateFields();
    const data = {
      date: new Date(row.date).getTime(),
      amount: parseFloat(row.amount),
      subtype: row.subtype,
      payway: row.payway,
    };

    handle_app_spinning(true);
    fetch_plus('/ledger/bill_list/update_one:id', {
      method: 'POST',
      body: JSON.stringify({
        id,
        data,
      }),
    })
      .then(() => {
        // 修改成功后刷新列表
        fetch_ledger_billlist_data().then(() => {
          handle_app_spinning(false);
          setEditingRowKey('');
        });
      });
  };

  // 删除当前行
  const handleRecordDelete = (id) => {
    handle_app_spinning(true);
    fetch_plus(`/ledger/billlist/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        fetch_ledger_billlist_data().then(() => {
          handle_app_spinning(false);
          message.success(response.message, 5);
        });
      });
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  function EditableCell({
    // eslint-disable-next-line react/prop-types
    editing, dataIndex, title, record, index, children,
    ...restProps
  }) {
    let inputNode = null;
    switch (dataIndex) {
      case 'date': inputNode = <DatePicker />; break;
      case 'amount': inputNode = <InputNumber />; break;
      case 'subtype':
        inputNode = (
          <RenderSubtypesByCategory
            ledgerCategory={ledgerCategory}
            ledgerSubtypes={ledgerSubtypes}
            // eslint-disable-next-line react/prop-types
            initialValues={record.subtype}
          />
        );
        break;
      case 'payway':
        inputNode = (
          <Select className="font-13" style={{ minWidth: '100px' }}>
            {PAY_WAY_LIST.map((item) => (
              <Select.Option key={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        );
        break;
      default: inputNode = <Input />;
    }

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <td {...restProps}>
        {
          editing ? (
            <Form.Item
              name={dataIndex}
              className="m-0"
              rules={[
                {
                  required: true,
                  message: `Required ${title}!`,
                },
              ]}
            >
              {inputNode}
            </Form.Item>
          ) : children
        }
      </td>
    );
  }

  // const rDate = null;
  // const rowSpanIndex = null;
  const basicTableColumns = [{ // ID
    title: 'ID',
    width: '50px',
    editable: false,
    render(text, record, index) {
      return index + 1;
    },
  }, { // 日期
    title: i18n.t('date'),
    dataIndex: 'date',
    width: '120px',
    editable: false,
    // sorter: (a, b) => a.date - b.date,
    render(text) {
      return dayjs(text).format('YYYY-MM-DD');
    },
    // onCell(_, index) {
    //   // 同一天的数据合并天展示
    //   // 调试发现每组数据会有多次渲染，所以把rowSpan记录到index上
    //   if (_.date !== rDate) {
    //     rDate = _.date;
    //     rowSpanIndex[index] = ledgerBilllist.filter(
    //       (item) => item.date === rDate,
    //     ).length;
    //   }
    //   return { rowSpan: rowSpanIndex[index] || 0 };
    // },
  }, { // 金额
    dataIndex: 'amount',
    title: i18n.t('amount'),
    width: '80px',
    editable: true,
    render(text) {
      return `￥${text}`;
    },
  }, { // 支付方式
    dataIndex: 'payway',
    title: i18n.t('pay_way'),
    width: '100px',
    editable: true,
    filterSearch: true,
    filters: PAY_WAY_LIST.map((item) => ({
      text: item.label,
      value: item.key,
    })),
    onFilter(value, record) { return record.payway.startsWith(value); },
    render(_) {
      return (
        <span className="font-12">
          {PAY_WAY_LIST.find((item) => item.key === _)?.label}
        </span>
      );
    },
  }, { // 消费类型
    dataIndex: 'subtype',
    title: i18n.t('subtype'),
    width: '180px',
    editable: true,
    filterMode: 'tree',
    filters: ledgerCategory.map((item) => ({
      text: item.text,
      value: item.key,
      children: ledgerSubtypes
        .filter((i) => i.categoryID === item.key)
        .map((i) => ({
          text: i.text,
          value: i.key,
        })),
    })),
    onFilter(value, record) { return record.subtype.startsWith(value); },
    render(_id) {
      const subtype = ledgerSubtypes.find((item) => item.key === _id);
      const category = ledgerCategory.find(
        (item) => item.key === subtype?.categoryID,
      );
      return <RenderSubtype subtype={subtype} category={category} />;
    },
  }, { // 备注
    title: i18n.t('description'),
    dataIndex: 'description',
    editable: true,
    render(text) {
      return <span className="font-12">{text}</span>;
    },
  }, {
    title: i18n.t('operation'),
    dataIndex: 'operation',
    render: (_, record) => (
      <>
        {
          // 编辑状态 => 显示save、cancel
          // 非编辑状态 => 显示edit按钮
          record.key === editingRowKey
            ? (
              <>
                <Typography.Link className="mr-2" onClick={() => handleRecordSave(record.key)}>Save</Typography.Link>
                <Typography.Link onClick={() => { setEditingRowKey(''); }}>Cancel</Typography.Link>
              </>
            )
            : <Typography.Link disabled={editingRowKey !== ''} onClick={() => handleRecordEdit(record)}>Edit</Typography.Link>
        }
        {/* 删除按钮 */}
        <Popconfirm title="Sure to delete?" onConfirm={() => handleRecordDelete(record.key)}>
          <Typography.Link disabled={editingRowKey !== ''} type="link" className="ml-2">Delete</Typography.Link>
        </Popconfirm>
      </>
    ),
  }];
  const basicTableMergedColumns = basicTableColumns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: record.key === editingRowKey,
      }),
    };
  });

  return (
    <Form form={billlistForm} component={false}>
      <Table
        size="small"
        className="font-12"
        pagination={false}
        // sortDirections={['ascend', 'descend', 'ascend']}
        columns={basicTableMergedColumns}
        dataSource={filter_sort_data_by_date_range(
          ledgerBilllist,
          datePickerRange,
        )}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
      />
    </Form>
  );
}
LedgerListTable.propTypes = { // 使用prop-type进行类型检查
  ...ledgerCategoryProptypes,
  ...ledgerSubtypesProptypes,
  ...ledgerBilllistProptypes,
  datePickerRange: PropTypes.number.isRequired,
  fetch_ledger_billlist_data: PropTypes.func.isRequired,
  handle_app_spinning: PropTypes.func.isRequired,
};
export default connect(
  (state) => ({
    ledgerCategory: state.ledgerCategory,
    ledgerSubtypes: state.ledgerSubtypes,
    ledgerBilllist: state.ledgerBilllist,
    datePickerRange: state.datePickerRange,
  }),
  {
    handle_app_spinning: actions.handle_app_spinning,
    fetch_ledger_billlist_data: actions.fetch_ledger_billlist_data,
  },
)(LedgerListTable);
