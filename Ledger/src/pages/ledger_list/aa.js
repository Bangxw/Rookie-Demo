import React, { useState } from 'react';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card, Form, Table, Button, Popconfirm, message, Space, Typography, DatePicker,
} from 'antd';
import i18n from '@i18n';
import RenderSubtype from '@components/render_subtype';
import { PAY_WAY_LIST } from '@src/const';
import { fetch_plus } from '@utils/common';
import { fetch_ledger_billlist_data, handle_app_spinning } from '@redux/actions';

function combine_same_one_date_data(data) {
  const combineData = [];
  let temp = {
    date: null, amount: 0, subtype: [], payway: [],
  };
  data
    .sort((a, b) => b.date - a.date)
    .forEach((item, index) => {
      if (!moment(item.date).isSame(temp.date, 'day')) {
        // 判断是不是同一天的数据
        if (index !== 0) {
          combineData.push({
            ...temp,
            key: index,
            amount: temp.amount.toFixed(2),
            subtype: Array.from(new Set(temp.subtype)), // 数组去重
            payway: Array.from(new Set(temp.payway)), // 数组去重
          });
        }
        temp = {
          date: item.date,
          amount: 0,
          subtype: [],
          payway: [],
        };
      }
      temp.amount += item.amount;
      temp.subtype.push(item.subtype_id);
      temp.payway.push(item.payway);
    });
  return combineData;
}

function PopHoverConteng(item, ledgerSubtypes) {
  const { subtype_id, payway } = item;
  // eslint-disable-next-line react/destructuring-assignment
  const subtype = ledgerSubtypes.find((_) => _.key === subtype_id);
  return (
    <div className="font-12">
      <RenderSubtype
        subtype={subtype}
      />
      <span className="mx-2">
        {PAY_WAY_LIST.find((_) => _.key === payway)?.label}
      </span>
      {item?.description}
    </div>
  );
}

function Dashboard(props) {
  const { ledgerList, ledgerSubtypes, datePickerRange } = props;
  const dashboardConfig = {
    data: filter_sort_data_by_date_range(
      combine_same_one_date_data(ledgerList).reverse(),
      datePickerRange,
    ).map((item) => ({
      ...item,
      amount: parseInt(item.amount, 10),
      date: moment(item.date).format('yy-MM-DD'),
    })),
    xField: 'date',
    yField: 'amount',
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    slider: {
      start: '',
      height: 50,
    },
    tooltip: {
      customContent: (value) => {
        const currentDayList = ledgerList.filter((item) => moment(value).isSame(moment(item.date), 'day'));
        return currentDayList.map((item) => (
          <div className="space-between-flex my-2">
            <RenderSubtype
              subtype={ledgerSubtypes.find(
                (_) => _.key === item.subtype_id,
              )}
            />
            <div className="clearfix font-12">
              <span style={{ float: 'right' }}>{`￥${item.amount}`}</span>
              {item.description && (
                <>
                  <br />
                  (
                  {item.description}
                  )
                </>
              )}
            </div>
          </div>
        ));
      },
    },
    label: {
      content: '111',
      position: 'top', // 'top', 'bottom', 'middle',
      style: {
        // 配置样式
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
  };
  const colorPresets = [
    'yellow',
    'orange',
    'cyan',
    'green',
    'blue',
    'purple',
    'geekblue',
    'geekblue',
  ];

  return (
    <Row>
      <Col span={18}>
        {' '}
        <Column {...dashboardConfig} className="pt-5" />
      </Col>
      <Col span={5} offset={1}>
        <List
          size="small"
          header={<div>Top 10消费:</div>}
          dataSource={filter_sort_data_by_date_range(
            ledgerList,
            datePickerRange,
          )
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10)}
          renderItem={(item, index) => (
            <List.Item>
              <Popover title={false} content={PopHoverConteng(item, ledgerSubtypes)}>
                <div className="space-between-flex width-100">
                  <span>
                    {index <= 2 ? (
                      <Badge count={index + 1} />
                    ) : (
                      <Badge color={colorPresets[index - 3]} className="px-2" />
                    )}
                    <span className="ml-1">
                      {moment(item.date).format('YY-MM-DD')}
                    </span>
                  </span>
                  <span>
                    ￥
                    {item.amount}
                  </span>
                </div>
              </Popover>
            </List.Item>
          )}
        />
      </Col>
    </Row>
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

function RenderSummary() {
  let summary = 0;
  // 过滤在选择的时间内的数据，精度到天（day）
  summary = filter_sort_data_by_date_range(
    ledgerList,
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

function EditableCell({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  ...restProps
}) {
  let inputNode = null;
  switch (dataIndex) {
    case 'date':
      inputNode = <DatePicker />;
      break;
    case 'amount':
      inputNode = <InputNumber />;
      break;
    case 'subtype_id':
      inputNode = (
        <Select className="font-13">
          {ledgerSubtypes.map((_) => (
            <Select.Option key={_.key} value={_.key}>
              <RenderSubtype
                subtype={_}
                category={ledgerCategory.find(
                  (item) => item.key === _.categoryID,
                )}
              />
            </Select.Option>
          ))}
        </Select>
      );
      break;
    case 'payway':
      inputNode = (
        <Select className="font-13">
          {PAY_WAY_LIST.map((item) => (
            <Select.Option value={item.key} key={item.key}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
      );
      break;
    default:
      inputNode = <Input />;
  }

  return (
    <td {...restProps}>
      {editing ? (
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
      ) : (
        children
      )}
    </td>
  );
}

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
    fetch_plus('/ledger/bill_list/delete_one:id', {
      method: 'POST',
      body: JSON.stringify({
        id,
      }),
    })
      .then((response) => {
        fetch_ledger_billlist_data().then(() => {
          handle_app_spinning(false);
          message.success(response.message, 5);
        });
      });
  };

  const rDate = null;
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
    <Card type="inner" className="mb-4">
      <div className="space-between-flex">
        <div>
          <Button
            type="primary"
            className="mr-3"
          >
            Add Items
          </Button>
          <Button
            type="primary"
            danger
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
                  summary={RenderSummary}
                  components={{
                    body: { cell: EditableCell },
                  }}
                  rowSelection={{
                    selectedRowKeys,
                    onChange: (newSelectedRowKeys) => {
                      setSelectedRowKeys(newSelectedRowKeys);
                    },
                  }}
                />
              </Form>
            )
        }
    </Card>
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
