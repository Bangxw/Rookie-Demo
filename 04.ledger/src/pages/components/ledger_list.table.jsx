import React from 'react';
import { connect } from 'react-redux'
import { Table, Tag, Popconfirm, message, Card } from 'antd';

import { set_app_spinning, get_ledger_list } from '@redux/actions'
import { ICON_FONT as IconFont } from '@/const'

const WEEK_STRINGS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function format_date(text) {
  let _d = new Date(text)
  return `${_d.toLocaleDateString()} ${WEEK_STRINGS[_d.getDay()]}`
}

const LedgerListTable = props => {
  const handleDelete = _id => {
    props.set_app_spinning(true)
    fetch('http://127.0.0.1:8800/ledger/bill_list/delete_one:id', {
      method: 'POST',
      body: JSON.stringify({
        id: _id
      })
    }).then(data => {
      props.get_ledger_list().then(() => {
        props.set_app_spinning(false)
        message.success(`Delete id:${_id} success!`, 5);
      })
    });
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      width: '150px',
      render(text) {
        return <>{format_date(text)}</>
      }
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '150px',
      render(text) {
        return <>{`￥${text}`}</>
      }
    },
    {
      title: '交易类型',
      dataIndex: 'subtype_id',
      width: '150px',
      filters: props.ledgerSubTypes,
      onFilter: (value, record) => record.address.startsWith(value),
      filterSearch: true,
      render(_id, record, index) {
        const findLedgerSubtypeByID = props.ledgerSubTypes.find(item => item._id === _id)
        if (!findLedgerSubtypeByID) return;
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconFont type={findLedgerSubtypeByID.icon} style={{ fontSize: '26px' }} />&nbsp;<Tag>{findLedgerSubtypeByID.text}</Tag>
          </div>
        )
      }
    },
    {
      title: '支付通道',
      dataIndex: 'payway',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
        props.ledgerList.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record._id)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <Card type="inner" bordered={false} className='mb-4'>
      <Table columns={columns} dataSource={props.ledgerList} size="middle" />
    </Card>
  );
};

export default connect(
  state => ({
    ledgerList: state.ledgerList,
    ledgerSubTypes: state.ledgerSubTypes,
  }),
  { set_app_spinning, get_ledger_list }
)(LedgerListTable);