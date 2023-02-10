import React, { useState } from 'react';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card, Form, Table, Button, Popconfirm, message, Space, Typography, DatePicker,
} from 'antd';
import i18n from '@i18n';
import RenderSubtype from '@components/render_subtype';
import { PAY_WAY_LIST, FETCH_URL } from '@src/const';
import { fetch_ledger_billlist_data, handle_app_spinning } from '@redux/actions';

// 按日期排序并且过滤为指定时间段内的数据
function filter_sort_data_by_date_range(data, dateRange) {
  const newData = data.sort((a, b) => a.date - b.date);
  if (dateRange === -1) return newData;
  return newData.filter(
    (item) => moment(item.date).isAfter(dateRange[0], 'day')
      && moment(item.date).isBefore(dateRange[1], 'day'),
  );
}

// 渲染时间段控件
function RenderDatePickerControl({
  datePickerRange,
  setDatePickerRange,
}) {
  const currentWeek = [moment().startOf('week'), moment().endOf('week')];
  const currentMonth = [moment().startOf('month'), moment().endOf('month')];
  const currentYear = [moment().startOf('year'), moment().endOf('year')];
  return (
    <Space className="font-12">
      <Typography.Link onClick={() => setDatePickerRange(currentWeek)}>
        {i18n.t('current_week')}
      </Typography.Link>
      <Typography.Link onClick={() => setDatePickerRange(currentMonth)}>
        {i18n.t('current_month')}
      </Typography.Link>
      <Typography.Link onClick={() => setDatePickerRange(currentYear)}>
        {i18n.t('current_year')}
      </Typography.Link>
      <Typography.Link onClick={() => setDatePickerRange(-1)}>
        All
      </Typography.Link>
      <DatePicker.RangePicker
        value={datePickerRange}
        className="ml-2"
        onChange={(value) => {
          setDatePickerRange(value);
        }}
      />
    </Space>
  );
}
RenderDatePickerControl.propTypes = {
  datePickerRange: PropTypes.number.isRequired,
  setDatePickerRange: PropTypes.func.isRequired,
};

// 渲染列表
function BilllistTable({
  ledgerBilllist,
  ledgerCategory,
  ledgerSubtypes,
}) {
  const [billlistForm] = Form.useForm();
  const [editingRowKey, setEditingRowKey] = useState(''); // 当前正在编辑行的key值
  const [datePickerRange, setDatePickerRange] = useState(-1); // -1 => 展示所有数据，其它展示指定时间段数据
  const [showDashboard, setShowDashboard] = useState(false); // 是否展示dashboard

  // 编辑当前行
  const handleRecordEdit = (record) => {
    setEditingRowKey(record.key);
    billlistForm.setFieldsValue({
      ...record,
      date: moment(record.date),
    });
  };

  // 保存编辑的数据
  const handleRecordSave = async (id) => {
    // 等待表单校验并且拿到form fields
    const row = await billlistForm.validateFields();
    const data = {
      date: new Date(row.date).getTime(),
      amount: parseFloat(row.amount),
      subtype_id: row.subtype_id,
      payway: row.payway,
    };

    handle_app_spinning(true);
    fetch(`${FETCH_URL}/ledger/bill_list/update_one:id`, {
      method: 'POST',
      body: JSON.stringify({
        id,
        data,
      }),
    }).then((response) => response.json())
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
    fetch('http://127.0.0.1:8800/ledger/bill_list/delete_one:id', {
      method: 'POST',
      body: JSON.stringify({
        id,
      }),
    }).then((response) => response.json())
      .then((response) => {
        fetch_ledger_billlist_data().then(() => {
          handle_app_spinning(false);
          message.success(response.message, 5);
        });
      });
  };

  let rDate = null;
  const rowSpanIndex = null;
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
      return moment(text).format('YYYY-MM-DD');
    },
    onCell(_, index) {
      // 同一天的数据合并天展示
      // 调试发现每组数据会有多次渲染，所以把rowSpan记录到index上
      if (_.date !== rDate) {
        rDate = _.date;
        rowSpanIndex[index] = ledgerBilllist.filter(
          (item) => item.date === rDate,
        ).length;
      }
      return { rowSpan: rowSpanIndex[index] || 0 };
    },
  }, { // 金额
    dataIndex: 'amount',
    title: i18n.t('amount_1'),
    width: '80px',
    editable: true,
    render(text) {
      return `￥${text}`;
    },
  }, { // 支付方式
    dataIndex: 'payway',
    title: i18n.t('pay_way'),
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
    dataIndex: 'subtype_id',
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
    onFilter(value, record) { return record.subtype_id.startsWith(value); },
    render(_id) {
      const subtype = ledgerSubtypes.find((item) => item.key === _id);
      const category = ledgerCategory.find(
        (item) => item.key === subtype?.categoryID,
      );
      return <RenderSubtype subtype={subtype} category={category} />;
    },
  }, { // 备注
    title: '备注',
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
                <Button type="link" className="mr-2" onClick={() => handleRecordSave(record.key)}>Save</Button>
                <Button type="link" onClick={() => { setEditingRowKey(''); }}>Cancel</Button>
              </>
            )
            : <Button disabled={editingRowKey !== ''} onClick={() => handleRecordEdit(record)}>Edit</Button>
        }
        {/* 删除按钮 */}
        <Popconfirm title="Sure to delete?" onConfirm={() => handleRecordDelete(record.key)}>
          <Button disabled={editingRowKey !== ''} type="link" className="ml-2">Delete</Button>
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
    <>
      {/* 书签式菜单 */}
      <div className="bookmarks-menu">
        <ul>
          <li onClick={() => { setShowDashboard(!showDashboard); }} aria-hidden="true">
            Toggle Show
          </li>
        </ul>
      </div>

      <Card type="inner" className="mb-4">
        <div className="space-between-flex">
          <div>
            <Button
              type="primary"
              className="mr-3"
            // onClick={() => onShowAddMultiModal(true)}
            >
              Add Items
            </Button>
            <Button
              type="primary"
              className="mr-3"
            // onClick={() => onShowSubtypeManageModal(true)}
            >
              Subtype Manage
            </Button>
            <Button
              type="primary"
              danger
            // disabled={selectedRowKeys.length === 0}
            // onClick={handleDeleteMany}
            >
              Delete Selected
            </Button>
          </div>
          <RenderDatePickerControl
            datePickerRange={datePickerRange}
            setDatePickerRange={setDatePickerRange}
          />
        </div>

        {
          showDashboard
            ? <div>111</div>
            : (
              <Form form={billlistForm} component={false}>
                <Table
                  size="small"
                  className="font-12"
                  pagination={false}
                  sortDirections={['ascend', 'descend', 'ascend']}
                  columns={basicTableMergedColumns}
                  dataSource={filter_sort_data_by_date_range(
                    ledgerBilllist,
                    datePickerRange,
                  )}
                />
              </Form>
            )
        }
      </Card>
    </>
  );
}
BilllistTable.propTypes = {
  ledgerBilllist: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      date: PropTypes.number.isRequired,
      amount: PropTypes.number.isRequired,
      payway: PropTypes.string.isRequired,
      subtype_id: PropTypes.string.isRequired,
      description: PropTypes.string,
    }).isRequired,
  ).isRequired,
  ledgerCategory: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  ledgerSubtypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

export default connect(
  (state) => ({
    ledgerCategory: state.ledgerCategory,
    ledgerSubtypes: state.ledgerSubtypes,
    ledgerBilllist: state.ledgerBilllist,
  }),
)(BilllistTable);
