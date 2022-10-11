import { Table, Tag, Popconfirm, message } from 'antd';
import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { ICONFONT_URL } from '@/const'

const IconFont = createFromIconfontCN({
  scriptUrl: [ICONFONT_URL],
});

const WEEK_STRINGS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const format_date = text => {
  var _d = new Date(text)
  return `${_d.toLocaleDateString()} ${WEEK_STRINGS[_d.getDay()]}`
}

const LedgerListTable = (props) => {

  const handleDelete = (_id) => {
    // const newData = dataSource.filter((item) => item.key !== key);
    // setDataSource(newData);
    fetch('http://127.0.0.1:8800/ledger/bill_list/delete_one:id', {
      method: 'POST',
      body: JSON.stringify({
        id: _id
      })
    })
      .then(data => {
        message.success(`Delete id:${_id} success!`, 5);
        props.onRefreshData()
      });
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'Date',
      width: '150px',
      render(text) {
        return <>{format_date(text)}</>
      }
    },
    {
      title: 'Amount',
      dataIndex: 'Amount',
      width: '150px',
      render(text) {
        return <>{`￥${text}`}</>
      }
    },
    {
      title: 'Tags',
      dataIndex: 'Tags',
      width: '150px',
      filters: props.ledgerSubTypes,
      onFilter: (value, record) => record.address.startsWith(value),
      filterSearch: true,
      render(item, record, index) {
        return <div style={{ display: 'flex', alignItems: 'center' }}><IconFont type={item.icon[1]} style={{ fontSize: '26px' }} />&nbsp;<Tag color={item.icon[0]}>{item.text}</Tag></div>
      }
    },
    {
      title: '支付通道',
      dataIndex: 'PayWay',
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
    <Table columns={columns} dataSource={props.ledgerList} size="middle" />
  );
};

export default LedgerListTable