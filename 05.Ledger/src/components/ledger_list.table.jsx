import { Table, Tag } from 'antd';
import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import ICONFONT_URL from '../const'

const IconFont = createFromIconfontCN({
  scriptUrl: [ICONFONT_URL],
});

const WEEK_STRINGS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const format_date = text => {
  var _d = new Date(text)
  return `${_d.toLocaleDateString()} ${WEEK_STRINGS[_d.getDay()]}`
}

const LedgerListTable = (props) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'Date',
      width: '15%',
      render(text) {
        return <>{format_date(text)}</>
      }
    },
    {
      title: 'Amount',
      dataIndex: 'Amount',
      width: '15%',
      render(text) {
        return <>{`￥${text}`}</>
      }
    },
    {
      title: 'Tags',
      dataIndex: 'Tags',
      filters: props.classificationTags,
      onFilter: (value, record) => record.address.startsWith(value),
      filterSearch: true,
      width: '40%',
      render(text, record, index) {
        return <> {
          text.map((item, i) => (
            <Tag color={props.classificationTags[item].color} icon={<IconFont type={props.classificationTags[item].icon} />} key={i}>{props.classificationTags[item].text}</Tag>
          ))
        } </>
      }
    },
  ];

  return (
    <Table columns={columns} dataSource={props.ledgerList} size="middle" />
  );
};

export default LedgerListTable