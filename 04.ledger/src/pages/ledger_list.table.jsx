import React, { useState } from 'react';
import { connect } from 'react-redux'
import { Table, Popconfirm, message, Card, Button, Select, Space, DatePicker, InputNumber, Input, Form, Typography, Modal, Tooltip } from 'antd';
import { SearchOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs'
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"

import { RenderSubtype } from '@components'
import { set_app_spinning, get_ledger_list } from '@redux/actions'
import { ICON_FONT as IconFont, PAY_WAY_LIST } from '@/const'
import { get_format_date, get_year_ago_date, get_month_ago_date, get_day_ago_date } from '@utils/common'


//https://github.com/ant-design/ant-design/issues/26190#issuecomment-703673400
dayjs.extend(weekday)
dayjs.extend(localeData)


const LedgerListTable = props => {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [rangePickerDefineValue, setRangePickerDefineValue] = useState()
  const [editingKey, setEditingKey] = useState('');

  const handleEdit = record => {
    form.setFieldsValue({
      ...record,
      'date': dayjs(new Date(), 'YYYY-MM-DD'),
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

  const DateOnFilter = ([value, record]) => {
    let date = null
    if (value === 0) { // 自定义时间段
      date = rangePickerDefineValue.map(item => new Date(item._d).getTime())
      return record['date'] > date[0] && record['date'] < date[1]
    } else {
      switch (value) {
        case 7: date = get_day_ago_date(7); break;
        case 30: date = get_month_ago_date(1); break;
        case 182: date = get_month_ago_date(6); break;
        case 365: date = get_year_ago_date(1); break;
        default: date = 0;
      }
      return record['date'] > date
    }
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

  const pagination = {
    showSizeChanger: true,
    defaultPageSize: 50,
    showQuickJumper: true,
    onShowSizeChange: (current, size) => { console.log(current, size) },
    showTotal: total => `Total ${total} items`
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: newSelectedRowKeys => {
      console.log('selectedRowKeys changed: ', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const ledgerListColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      width: '150px',
      editable: true,
      sorter: (a, b) => a.date - b.date,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div className='p-2 font-13'>
          <Select
            style={{ width: 120, }}
            value={selectedKeys[0]}
            onChange={value => setSelectedKeys([value])}
            placeholder='按条件过滤'
            options={[
              { value: 7, label: '最近一周', },
              { value: 30, label: '最近一月', },
              { value: 182, label: '最近半年', },
              { value: 365, label: '最近一年', },
              { value: 0, label: '自定义', },
            ]}
          />
          {
            selectedKeys[0] === 0 ? <DatePicker.RangePicker className="ml-2" onChange={value => { setRangePickerDefineValue(value) }} /> : ''
          }
          <Space align='end' className="mt-3 filter-buttons">
            <Button type="primary" size="small" icon={<SearchOutlined />} onClick={() => { confirm({ closeDropdown: true }) }}>Filter</Button>
            <Button size="small" style={{ width: 90, }} onClick={() => clearFilters && clearFilters()}>Reset</Button>
          </Space>
        </div>
      ),
      onFilter: (...rest) => DateOnFilter(rest),
      onFilterDropdownOpenChange: (visible) => { },
      render: text => <>{get_format_date(text, 'yy/MM/dd w')}</>
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '150px',
      editable: true,
      sorter: (a, b) => a.amount - b.amount,
      render: (text, record) => record.description ? <Tooltip title={record.description} color='gold'>{`￥${text}`}</Tooltip> : `￥${text}`
    },
    {
      title: '交易类型',
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
      title: '支付通道',
      dataIndex: 'payway',
      editable: true,
      filterSearch: true,
      filters: PAY_WAY_LIST.map(item => ({ text: item.label, value: item.key })),
      onFilter: (value, record) => record.payway.startsWith(value),
      render: _ => (
        PAY_WAY_LIST.find(item => item.key === _)?.label
      ),
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

  const mergedColumns = ledgerListColumns.map(col => {
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

  return (
    <Card type="inner" bordered={false} className='mb-4'>
      <Space className='mb-2'>
        <Button type="primary" onClick={() => props.onShowMultiRecordsModal(true)} icon={<IconFont type="icon-edit" style={{ fontSize: '16px' }} />}>点我，新增多条</Button>
        <Button type='primary' danger disabled={selectedRowKeys.length === 0} onClick={handleDeleteMany}>Delete All</Button>
      </Space>
      <Form form={form} component={false}>
        <Table size="middle"
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={mergedColumns}
          dataSource={props.ledgerList}
          pagination={pagination}
          sortDirections={['ascend', 'descend', 'ascend']}
          rowSelection={rowSelection} />
      </Form>
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