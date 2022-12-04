import React, { useState, useRef } from 'react';
import { connect } from 'react-redux'
import { Table, Popconfirm, message, Card, Button, Select, Space, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { RenderSubtype } from '@components'
import { set_app_spinning, get_ledger_list } from '@redux/actions'
import { PAY_WAY_LIST, WEEK_STRINGS } from '@/const'



function format_date(text) {
  let _d = new Date(text)
  return `${_d.toLocaleDateString()} ${WEEK_STRINGS[_d.getDay()]}`
}


const LedgerListTable = props => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [filterDateSelectValue, setFilterDateSelectValue] = useState(7)
  const [filterDateDefineValue, setFilterDateDefineValue] = useState()


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


  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const handleDateFilterd = () => {
    if (filterDateSelectValue !== 0) {

    }
  }


  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      width: '150px',
      filterDropdown({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) {
        return (
          <div className='p-2 font-13'>
            <span>按条件过滤：</span>
            <Select
              style={{ width: 120, }}
              value={filterDateSelectValue}
              onChange={value => setFilterDateSelectValue(value)}
              defaultValue={7}
              options={[
                { value: 7, label: '最近一周', },
                { value: 30, label: '最近一月', },
                { value: 182, label: '最近半年', },
                { value: 365, label: '最近一年', },
                { value: 0, label: '自定义', },
              ]}
            />
            {
              filterDateSelectValue === 0 ? <DatePicker.RangePicker className="ml-2" onChange={value => { setFilterDateDefineValue(value) }} /> : ''
            }
            <Space align='end' className="mt-3 filter-buttons">
              <Button type="primary" size="small" icon={<SearchOutlined />} onClick={() => {
                confirm({
                  closeDropdown: true,
                });
                setSelectedKeys(filterDateSelectValue)
                // console.log(setSelectedKeys, selectedKeys, confirm)
                // confirm();
              }}>Filter</Button>
              <Button size="small" style={{ width: 90, }}
                onClick={() => clearFilters && handleReset(clearFilters)}
              >Reset</Button>
            </Space>
          </div>
        )
      },
      onFilter: (value, record) => {

        console.log(record, value)
        // return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      },
      onFilterDropdownOpenChange: (visible) => {
        console.log(visible)
        if (visible) {
          setTimeout(() => {}, 100);
        }  
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a, b) => {
        return a.date - b.date
      },
      render(text) {
        return <>{format_date(text)}</>
      }
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '150px',
      sorter: (a, b) => {
        return a.amount - b.amount
      },
      render(text) {
        return <>{`￥${text}`}</>
      }
    },
    {
      title: '交易类型',
      dataIndex: 'subtype_id',
      width: '180px',
      filters: props.ledgerSubTypes,
      filterSearch: true,
      onFilter: (value, record) => record.address.startsWith(value),
      render(_id, record, index) {
        const subtype = props.ledgerSubTypes.find(item => item._id === _id)
        const category = props.ledgerCategory.find(item => item._id === subtype?.categoryID)
        return <RenderSubtype subtype={subtype} category={category} />
      }
    },
    {
      title: '支付通道',
      dataIndex: 'payway',
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
        props.ledgerList.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record._id)}>
            <Button type="link">Delete</Button>
          </Popconfirm>
        ) : null
      ),
    },
  ];

  const pagination = {
    pageSize: 20,
    showQuickJumper: true,
    showTotal: (total) => `Total ${total} items`
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: newSelectedRowKeys => {
      console.log('selectedRowKeys changed: ', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <Card type="inner" bordered={false} className='mb-4'>
      <Button type='primary' danger disabled={selectedRowKeys.length === 0} className='mb-2' onClick={handleDeleteMany}>Delete All</Button>
      <Table size="middle" columns={columns}
        dataSource={props.ledgerList}
        pagination={pagination}
        sortDirections={['ascend', 'descend', 'ascend']}
        rowSelection={rowSelection} />
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