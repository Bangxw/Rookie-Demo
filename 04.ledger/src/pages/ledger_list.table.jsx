/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  Table,
  Popconfirm,
  message,
  Card,
  Button,
  Select,
  Space,
  DatePicker,
  InputNumber,
  Input,
  Form,
  Typography,
  Modal,
  List,
  Row,
  Col,
  Popover,
  Badge,
} from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Column } from '@ant-design/plots';
import * as moment from 'moment';
import 'moment/locale/zh-cn';
import RenderSubtype from '@components';
import { handle_app_spinning, get_ledger_list } from '@redux/actions';
import i18n from '@i18n';
import { PAY_WAY_LIST } from '@/const';

// 按日期排序并且过滤指定日期间的数据
function filter_sort_data_by_date_range(data, dateRange) {
  const newData = data.sort((a, b) => a.date - b.date);
  if (dateRange === -1) return newData;
  return newData.filter(
    (item) => moment(item.date).isAfter(dateRange[0], 'day')
      && moment(item.date).isBefore(dateRange[1], 'day'),
  );
}

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

function PopHoverConteng(item, ledgerSubTypes) {
  const { subtype_id, payway } = item;
  // eslint-disable-next-line react/destructuring-assignment
  const subtype = ledgerSubTypes.find((_) => _.key === subtype_id);
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
  const { ledgerList, ledgerSubTypes, datePickerRange } = props;
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
              subtype={ledgerSubTypes.find(
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
              <Popover title={false} content={PopHoverConteng(item, ledgerSubTypes)}>
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

function LedgerListTable(props) {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [datePickerRange, setDatePickerRange] = useState(-1); // -1 => show all
  const [editingKey, setEditingKey] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const {
    handle_app_spinning: handle_app_spingning_status, // 控制spinning展示
    get_ledger_list: get_ledger_list_data,
    onShowAddMultiModal,
    onShowSubtypeManageModal,
    ledgerCategory,
    ledgerSubTypes,
    ledgerList,
  } = props;

  const handleEdit = (record) => {
    form.setFieldsValue({
      ...record,
      date: moment(record.date),
    });
    setEditingKey(record.key);
  };

  const handleSave = async (id) => {
    const row = await form.validateFields();
    handle_app_spingning_status(true);
    fetch('http://127.0.0.1:8800/ledger/bill_list/update_one:id', {
      method: 'POST',
      body: JSON.stringify({
        id,
        data: {
          date: new Date(row.date).getTime(),
          amount: parseFloat(row.amount),
          subtype_id: row.subtype_id,
          payway: row.payway,
        },
      }),
    })
      .then((response) => response.json())
      .then(() => {
        get_ledger_list_data().then(() => {
          handle_app_spingning_status(false);
          setEditingKey('');
        });
      });
  };

  const handleDelete = (_id) => {
    handle_app_spingning_status(true);
    fetch('http://127.0.0.1:8800/ledger/bill_list/delete_one:id', {
      method: 'POST',
      body: JSON.stringify({
        id: _id,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        get_ledger_list_data().then(() => {
          handle_app_spingning_status(false);
          message.success(response.message, 5);
        });
      });
  };

  const handleDeleteMany = () => {
    Modal.confirm({
      title: 'Are you sure delete this task?',
      icon: <ExclamationCircleFilled />,
      content:
        'After clicking the Yes button, all the selected data will be deleted. This operation cannot be undone!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handle_app_spingning_status(true);
        fetch('http://127.0.0.1:8800/ledger/bill_list/delete:ids', {
          method: 'POST',
          body: JSON.stringify({
            ids: selectedRowKeys,
          }),
        })
          .then((response) => response.json())
          .then((response) => {
            get_ledger_list_data().then(() => {
              setSelectedRowKeys([]);
              handle_app_spingning_status(false);
              message.success(response.message, 5);
            });
          });
      },
    });
  };

  let rDate = null;
  const rowSpanIndex = {};
  const basicTableColumns = [
    {
      title: 'ID',
      width: '50px',
      editable: false,
      render(text, record, index) {
        return index + 1;
      },
    },
    {
      dataIndex: 'date',
      title: i18n.t('date'),
      width: '120px',
      editable: false,
      // sorter: (a, b) => a.date - b.date,
      render(text) {
        return moment(text).format('YYYY-MM-DD');
      },
      onCell: (_, index) => {
        // 同一天的数据合并天展示
        // 调试发现每组数据会有多次渲染，所以把rowSpan记录到index上
        if (_.date !== rDate) {
          rDate = _.date;
          rowSpanIndex[index] = ledgerList.filter(
            (item) => item.date === rDate,
          ).length;
        }
        return { rowSpan: rowSpanIndex[index] || 0 };
      },
    },
    {
      dataIndex: 'amount',
      title: i18n.t('amount_1'),
      width: '80px',
      editable: true,
      render(text) {
        return `￥${text}`;
      },
    },
    {
      dataIndex: 'payway',
      title: i18n.t('pay_way'),
      editable: true,
      filterSearch: true,
      filters: PAY_WAY_LIST.map((item) => ({
        text: item.label,
        value: item.key,
      })),
      onFilter: (value, record) => record.payway.startsWith(value),
      render(_) {
        return (
          <span className="font-12">
            {PAY_WAY_LIST.find((item) => item.key === _)?.label}
          </span>
        );
      },
    },
    {
      dataIndex: 'subtype_id',
      title: i18n.t('subtype'),
      width: '180px',
      editable: true,
      filterMode: 'tree',
      filters: ledgerCategory.map((item) => ({
        text: item.text,
        value: item.key,
        children: ledgerSubTypes
          .filter((i) => i.categoryID === item.key)
          .map((i) => ({
            text: i.text,
            value: i.key,
          })),
      })),
      onFilter: (value, record) => record.subtype_id.startsWith(value),
      render(_id) {
        const subtype = ledgerSubTypes.find((item) => item.key === _id);
        const category = ledgerCategory.find(
          (item) => item.key === subtype?.categoryID,
        );
        return <RenderSubtype subtype={subtype} category={category} />;
      },
    },
    {
      title: '备注',
      dataIndex: 'description',
      editable: true,
      render(text) {
        return <span className="font-12">{text}</span>;
      },
    },
    {
      title: i18n.t('operation'),
      dataIndex: 'operation',
      render: (_, record) => (
        <>
          {record.key === editingKey ? (
            <>
              <Typography.Link
                onClick={() => handleSave(record.key)}
                className="mr-2"
              >
                Save
              </Typography.Link>
              <Typography.Link
                onClick={() => {
                  setEditingKey('');
                }}
              >
                Cancel
              </Typography.Link>
            </>
          ) : (
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => handleEdit(record)}
            >
              Edit
            </Typography.Link>
          )}
          {ledgerList.length >= 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <Typography.Link
                disabled={editingKey !== ''}
                type="link"
                className="ml-2"
              >
                Delete
              </Typography.Link>
            </Popconfirm>
          ) : null}
        </>
      ),
    },
  ];

  const basicTableMergedColumns = basicTableColumns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: record.key === editingKey,
      }),
    };
  });

  function RenderDatePickerControl() {
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
            {ledgerSubTypes.map((_) => (
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

  return (
    <>
      <div className="bookmarks-menu">
        <ul>
          <li
            onClick={() => {
              setShowDashboard(false);
            }}
            aria-hidden="true"
          >
            Ledger List
          </li>
          <li
            onClick={() => {
              setShowDashboard(true);
            }}
            aria-hidden="true"
          >
            Dashboard
          </li>
        </ul>
      </div>

      <Card type="inner" bordered={false} className="mb-4">
        <div className="space-between-flex mb-3">
          <div>
            <Button
              type="primary"
              className="mr-3"
              onClick={() => onShowAddMultiModal(true)}
            >
              Add Items
            </Button>
            <Button
              type="primary"
              className="mr-3"
              onClick={() => onShowSubtypeManageModal(true)}
            >
              Subtype Manage
            </Button>
            <Button
              type="primary"
              danger
              disabled={selectedRowKeys.length === 0}
              onClick={handleDeleteMany}
            >
              Delete Selected
            </Button>
          </div>
          <RenderDatePickerControl />
        </div>

        {showDashboard ? (
          <Dashboard
            ledgerSubTypes={ledgerSubTypes}
            ledgerList={ledgerList}
            datePickerRange={datePickerRange}
          />
        ) : (
          <Form form={form} component={false}>
            <Table
              size="small"
              className="font-12"
              pagination={false}
              sortDirections={['ascend', 'descend', 'ascend']}
              columns={basicTableMergedColumns}
              dataSource={filter_sort_data_by_date_range(
                ledgerList,
                datePickerRange,
              )} // 根据选择的时间范围过滤数据
              // eslint-disable-next-line react/jsx-no-bind
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
        )}
      </Card>
    </>
  );
}

export default connect(
  (state) => ({
    ledgerList: state.ledgerList,
    ledgerSubTypes: state.ledgerSubTypes,
    ledgerCategory: state.ledgerCategory,
  }),
  { handle_app_spinning, get_ledger_list },
)(LedgerListTable);
