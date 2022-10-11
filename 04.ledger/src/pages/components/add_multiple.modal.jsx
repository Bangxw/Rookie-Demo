import { Modal, Input, List, Popover } from 'antd';
import React, { useState, useEffect } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { ICONFONT_URL } from '@/const.js'

const IconFont = createFromIconfontCN({
  scriptUrl: [ICONFONT_URL],
});

const AddMultipleModal = props => {
  const poroverNode = <List
    size="small"
    bordered
    dataSource={props.ledgerSubTypes}
    renderItem={(item, index) =>
      <List.Item>
        {`${index} => `}<IconFont type={item.icon} style={{ fontSize: '16px' }} />{item.text}
      </List.Item>
    }
  />

  return (
    <Modal title="新增多条" open={props.showAddMultiModal} onOk={() => props.onShowAddMultiModal(true)} onCancel={() => props.onShowAddMultiModal(false)}>
      <div>
        <strong>示例：</strong>
        <p style={{ border: '1px dashed #ccc', padding: '5px', marginTop: '8px' }}>
          <small>220801 500 1</small><br />
          <small>220801 500 1</small><br />
          <small>...</small>
        </p>
        <p>
          <small>用空格分隔，第一个表示日期，第二个表示金额，第三个表示类别，其中类别分类如下：</small>
          <Popover content={poroverNode} title="Title">
            <IconFont type='icon-chat-help' style={{ fontSize: '16px' }} />
          </Popover>
        </p>
      </div>
      <Input.TextArea rows={5} style={{ resize: 'none' }} />
    </Modal>
  );
};

export default AddMultipleModal;