import React, { useState } from 'react';
import { connect } from 'react-redux'
import { Table, Popconfirm, message, Card, Button, Select, Space, DatePicker, InputNumber, Input, Form, Typography, Modal, Radio, List, Row, Col, Popover } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Column } from '@ant-design/plots';
import * as moment from 'moment';
import 'moment/locale/zh-cn'

import { RenderSubtype } from '@components'
import { set_app_spinning, get_ledger_list } from '@redux/actions'
import { PAY_WAY_LIST } from '@/const'

function filter_range_data(data, dateRange) {
  return data.filter(item => moment(item.date).isAfter(dateRange[0], 'day') && moment(item.date).isBefore(dateRange[1], 'day'))
}

const LedgerListTable = props => {
  const [form] = Form.useForm();
  const [displayMode, setDisplayMode] = useState('DASHBOARD');   // 展示模式：详细展示/源数据展示(ORIGIN)、按天合并数据展示(FILTER)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [rangePickerSummary, setRangePickerSummary] = useState([moment().startOf('year'), moment().endOf('year')])
  const [editingKey, setEditingKey] = useState('');
  const [paginationInfo, setPaginationInfo] = useState('1,1');

  const handleEdit = record => {
    form.setFieldsValue({
      ...record,
      'date': moment.now(),
    });
    setEditingKey(record._id);
  };

  const handleSave = async (id) => {
    try {
      const row = await form.validateFields();
      props.set_app_spinning(true)
      fetch('http://127.0.0.1:8800/ledger/bill_list/update_one:id', {
        method: 'POST',
        body: JSON.stringify({
          id,
          data: {
            date: new Date(row.date).getTime(),
            amount: parseFloat(row.amount),
            subtype_id: row.subtype_id,
            payway: row.payway,
          }
        })
      }).then(response => response.json())
        .then(response => {
          props.get_ledger_list().then(() => {
            props.set_app_spinning(false);
            setEditingKey('');
          })
        });
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDelete = _id => {
    props.set_app_spinning(true)
    fetch('http://127.0.0.1:8800/ledger/bill_list/delete_one:id', {
      method: 'POST',
      body: JSON.stringify({
        id: _id
      })
    }).then(response => response.json())
      .then(response => {
        props.get_ledger_list().then(() => {
          props.set_app_spinning(false)
          message.success(response.message, 5);
        })
      });
  };

  const handleDeleteMany = () => {
    Modal.confirm({
      title: 'Are you sure delete this task?',
      icon: <ExclamationCircleFilled />,
      content: 'After clicking the Yes button, all the selected data will be deleted. This operation cannot be undone!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        props.set_app_spinning(true)
        fetch('http://127.0.0.1:8800/ledger/bill_list/delete:ids', {
          method: 'POST',
          body: JSON.stringify({
            ids: selectedRowKeys
          })
        }).then(response => response.json())
          .then(response => {
            props.get_ledger_list().then(() => {
              setSelectedRowKeys([])
              props.set_app_spinning(false)
              message.success(response.message, 5);
            })
          });
      }
    });
  }

  const EditableCell = ({ editing, dataIndex, title, record, index, children, ...restProps }) => {
    let inputNode = null;
    switch (dataIndex) {
      case 'date': inputNode = <DatePicker />; break;
      case 'amount': inputNode = <InputNumber />; break;
      case 'subtype_id':
        inputNode = (
          <Select className='font-13'>
            {
              props.ledgerSubTypes.map((_, i) => (
                <Select.Option key={i} value={_._id}>
                  <RenderSubtype subtype={_} category={props.ledgerCategory.find(item => item._id === _.categoryID)} />
                </Select.Option>)
              )
            }
          </Select>
        )
        break;
      case 'payway':
        inputNode = (
          <Select className='font-13'>
            {
              PAY_WAY_LIST.map((item, index) => <Select.Option value={item.key} key={index}>{item.label}</Select.Option>)
            }
          </Select>
        )
        break;
      default: inputNode = <Input />;
    }

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item name={dataIndex} className="m-0"
            rules={[
              {
                required: true,
                message: `Required ${title}!`,
              },
            ]}
          >{inputNode}</Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const RenderDatePickerControl = () => {
    const currentWeek = [moment().startOf('week'), moment().endOf('week')]
    const currentMonth = [moment().startOf('month'), moment().endOf('month')]
    const currentYear = [moment().startOf('year'), moment().endOf('year')]
    return (<Space>
      <Typography.Link onClick={() => setRangePickerSummary(currentWeek)}>本周</Typography.Link>
      <Typography.Link onClick={() => setRangePickerSummary(currentMonth)}>本月</Typography.Link>
      <Typography.Link onClick={() => setRangePickerSummary(currentYear)}>本年</Typography.Link>
      <DatePicker.RangePicker className="ml-2"
        value={rangePickerSummary}
        onChange={value => { setRangePickerSummary(value) }}
      />
    </Space>)
  }

  const RenderSummary = () => {
    let summary = 0
    try {
      // 过滤在选择的时间内的数据，精度到天（day）
      summary = filter_range_data(props.ledgerList, rangePickerSummary).reduce((a, b) => (a + b.amount), 0)
    } catch (e) { }
    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell colSpan={3}>
            <Button type='primary' danger disabled={selectedRowKeys.length === 0} onClick={handleDeleteMany}>Delete Selected</Button>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={4}>Summary: ￥{summary.toFixed(2)}</Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    )
  }


  const pagination = {
    showSizeChanger: true,
    defaultPageSize: 50,
    showQuickJumper: true,
    showTotal: total => `Total ${total} items`,
    onChange: (page, pageSize) => { setPaginationInfo(`${page},${pageSize}`) }
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: newSelectedRowKeys => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const displayModeOptions = [{
    label: '按天展示',
    value: 'COMBINE',
  }, {
    label: '详细列表',
    value: 'ORIGIN',
  }, {
    label: 'DASHBOARD',
    value: 'DASHBOARD',
  },];

  const ledgerListTableColumns = [
    {
      title: 'ID',
      width: '50px',
      editable: false,
      render(text, record, index) { return index + 1 }
    },
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: (a, b) => a.date - b.date,
      render(text) { return moment(text).format('YYYY-MM-DD') }
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render(text) { return `￥${text}` }
    },
    {
      title: '支付通道',
      dataIndex: 'payway',
      render(payway) { return payway.map(_ => <span className='mr-2 font-12' key={_}>{PAY_WAY_LIST.find(item => item.key === _)?.label}</span>) },
    },
    {
      title: '交易类型',
      dataIndex: 'subtype',
      render: _ids => <Space>{_ids.map(_id => <RenderSubtype key={_id} subtype={props.ledgerSubTypes.find(item => item._id === _id)} />)}</Space>
    }
  ];

  const originTableColumns = [
    {
      ...ledgerListTableColumns[0],
      render: (text, record, index) => (paginationInfo.split(',')[0] - 1 * paginationInfo.split(',')[1]) + index + 1
    },
    {
      ...ledgerListTableColumns[1],
      width: '150px',
      editable: true,
    },
    {
      ...ledgerListTableColumns[2],
      width: '100px',
      editable: true,
    },
    {
      ...ledgerListTableColumns[3],
      editable: true,
      filterSearch: true,
      filters: PAY_WAY_LIST.map(item => ({ text: item.label, value: item.key })),
      onFilter: (value, record) => record.payway.startsWith(value),
      render(_) { return <span className="font-12">{PAY_WAY_LIST.find(item => item.key === _)?.label}</span> }
    },
    {
      ...ledgerListTableColumns,
      dataIndex: 'subtype_id',
      width: '180px',
      editable: true,
      filterMode: 'tree',
      filters: props.ledgerCategory.map(item => ({
        text: item.text,
        value: item._id,
        children: props.ledgerSubTypes.filter(i => i.categoryID === item._id).map(i => ({
          text: i.text,
          value: i._id,
        }))
      })),
      onFilter: (value, record) => record.subtype_id.startsWith(value),
      render(_id, record, index) {
        const subtype = props.ledgerSubTypes.find(item => item._id === _id)
        const category = props.ledgerCategory.find(item => item._id === subtype?.categoryID)
        return <RenderSubtype subtype={subtype} category={category} />
      }
    },
    {
      title: '备注',
      dataIndex: 'description',
      editable: true,
      render(text) { return <span className='font-12'>{text}</span> }
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => (
        <>
          {
            record._id === editingKey ? (
              <span>
                <Typography.Link onClick={() => handleSave(record._id)} className='mr-2'>Save</Typography.Link>
                <Typography.Link onClick={() => { setEditingKey('') }}>Cancel</Typography.Link>
              </span>
            ) : <Typography.Link disabled={editingKey !== ''} onClick={() => handleEdit(record)}>Edit</Typography.Link>
          }
          {
            props.ledgerList.length >= 1 ? (
              <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record._id)}>
                <Typography.Link disabled={editingKey !== ''} type="link" className='ml-2'>Delete</Typography.Link>
              </Popconfirm>
            ) : null
          }
        </>
      ),
    },
  ];

  const originTableMergedColumns = originTableColumns.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: record._id === editingKey,
      }),
    };
  });

  const dashboardConfig = {
    data: filter_range_data(combineSameDateData().reverse(), rangePickerSummary).map(item => ({
      ...item,
      amount: parseInt(item.amount),
      date: moment(item.date).format('yy-MM-DD')
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
      customContent: (value, items) => {
        const currentDayList = props.ledgerList.filter(item => moment(value).isSame(moment(item.date), 'day'))
        return currentDayList.map(item => (
          <div className='space-between-flex my-2'>
            <RenderSubtype subtype={props.ledgerSubTypes.find(_ => _._id === item.subtype_id)} />
            <div className="clearfix font-12">
              <span style={{ float: 'right' }}>{`￥${item.amount}`}</span>
              {item.description && <><br />({item.description})</>}
            </div>
          </div>
        ))
      },
    },
    label: {
      content: '111',
      position: 'top', // 'top', 'bottom', 'middle',
      style: {  // 配置样式
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
  };

  // 同一天的数据合并展示
  const combineSameDateData = () => {
    const ledgerListByDay = []
    let temp = { date: null, amount: 0, subtype: [], payway: [] }
    props.ledgerList.sort((a, b) => b.date - a.date).forEach((item, index) => {
      if (!moment(item.date).isSame(temp.date, 'day')) { // 判断是不是同一天的数据
        if (index !== 0) {
          ledgerListByDay.push({
            ...temp,
            key: index,
            amount: temp.amount.toFixed(2),
            subtype: Array.from(new Set(temp.subtype)), // 数组去重
            payway: Array.from(new Set(temp.payway)),   // 数组去重
          })
        }
        temp = {
          date: item.date,
          amount: 0,
          subtype: [],
          payway: []
        }
      }
      temp.amount += item.amount;
      temp.subtype.push(item.subtype_id);
      temp.payway.push(item.payway);
    })
    return ledgerListByDay
  }

  // 配置项

  // 视图组件

  const LedgerContent = () => {
    switch (displayMode) {
      // 合并同一天的数据展示（一天有多次消费）
      case 'COMBINE':
        return <Table size="small" className="font-12"
          columns={ledgerListTableColumns}
          dataSource={filter_range_data(combineSameDateData(), rangePickerSummary)}
          pagination={false}
        />;

      // 详细展示 源数据展示
      case 'ORIGIN':
        return <Form form={form} component={false}>
          <Table size="small"
            className="font-12"
            columns={originTableMergedColumns}
            summary={RenderSummary}
            dataSource={filter_range_data(props.ledgerList, rangePickerSummary)}
            pagination={pagination}
            sortDirections={['ascend', 'descend', 'ascend']}
            rowSelection={rowSelection}
            scroll={{ y: 500, }}
            components={{
              body: { cell: EditableCell, },
            }}
          />
        </Form>

      // 图标展示
      case 'DASHBOARD':
        return <Row>
          <Col span={18}><Column {...dashboardConfig} className="pt-5" /></Col>
          <Col span={5} offset={1}>
            <List
              size="small"
              header={<div>Top 10消费:</div>}
              dataSource={props.ledgerList.sort((a, b) => b.amount - a.amount).slice(0, 10)}
              renderItem={(item, index) => <List.Item>
                <Popover content={<RenderSubtype subtype={props.ledgerSubTypes.find(_ => _._id === item.subtype_id)} />}>
                  <div className="space-between-flex width-100">
                    <span>{`${index}. ${moment(item.date).format('YY-MM-DD')}`}</span>
                    <span>￥{item.amount}</span>
                  </div>
                </Popover>
              </List.Item>}
            />
          </Col>
        </Row>

      default: return '';
    }
  }

  return (
    <Card type="inner" bordered={false} className='mb-4'>
      <div className="space-between-flex">
        <Radio.Group optionType="button" className='mb-2 font-12'
          options={displayModeOptions}
          value={displayMode}
          onChange={(e) => setDisplayMode(e.target?.value)}
        />
        <RenderDatePickerControl />
      </div>
      <LedgerContent />
    </Card>
  );
};

export default connect(
  state => ({
    ledgerList: state.ledgerList,
    ledgerSubTypes: state.ledgerSubTypes,
    ledgerCategory: state.ledgerCategory,
  }),
  { set_app_spinning, get_ledger_list }
)(LedgerListTable);