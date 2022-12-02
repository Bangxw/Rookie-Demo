import React, { useState } from 'react';
import { connect } from 'react-redux'
import { Table, Tag, Popconfirm, message, Card, Button } from 'antd';

import { set_app_spinning, get_ledger_list } from '@redux/actions'
import { ICON_FONT as IconFont, PAY_WAY_LIST } from '@/const'

const WEEK_STRINGS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function format_date(text) {
  let _d = new Date(text)
  return `${_d.toLocaleDateString()} ${WEEK_STRINGS[_d.getDay()]}`
}

const LedgerListTable = props => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      width: '150px',
      sortDirections: ['descend'],
      render(text) {
        return <>{format_date(text)}</>
      }
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '150px',
      sorter: (a, b) => {
        const s = a.amount - b.amonut
        console.log(a, b, '------', a.amonut, b.amount, s)
        return s
      },
      // render(text) {
      //   return <>{`￥${text}`}</>
      // }
    },
    {
      title: '交易类型',
      dataIndex: 'subtype_id',
      width: '180px',
      filters: props.ledgerSubTypes,
      onFilter: (value, record) => record.address.startsWith(value),
      filterSearch: true,
      render(_id, record, index) {
        const subtype = props.ledgerSubTypes.find(item => item._id === _id)
        const categoty = props.ledgerCategory.find(item => item._id === subtype?.categoryID)
        return (
          <div className='font-13'>
            <IconFont type={subtype?.icon} className="font-18 mr-2" />
            {subtype?.text}
            <Tag className='font-12 ml-1'>{categoty?.text}</Tag>
          </div>
        )
      }
    },
    {
      title: '支付通道',
      dataIndex: 'payway',
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