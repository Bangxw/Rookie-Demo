import { Modal, Spin, message, Tag, Popover, Row, Col, Button, Popconfirm, Divider, Space, Layout } from 'antd';
import { EditableProTable, ProCard, ProFormField, ProFormRadio } from '@ant-design/pro-components';
import React, { useState } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { SketchPicker } from 'react-color';
import { ICONFONT_URL } from '../const'

const IconFont = createFromIconfontCN({
  scriptUrl: [ICONFONT_URL,],
});


const iconList = {
  '饮食': {
    color: '#F5222D',
    icon: ['icon-fastfood', 'icon-cooking', 'icon-fruit', 'icon-snacks',],
  },
  '消费': {
    color: '#FADB14',
    icon: ['icon-clothing', 'icon-daily',],
  },
  '交通': {
    color: '#52C41A',
    icon: ['icon-bus', 'icon-taxi', 'icon-plane',],
  },
  '家庭支出': {
    color: '#13C2C2',
    icon: ['icon-rent', 'icon-comm', 'icon-badminton',],
  },
  '其它': {
    color: '#1890FF',
    icon: ['icon-unknown'],
  }
}


const LedgerTagsManageModal = props => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState(props.classificationTags);
  const [position, setPosition] = useState('bottom');
  const [popoverShow, setPopoverShow] = useState(false);
  const [iconValue, setIconValue] = useState([]);

  const handleClick = (color, icon) => {
    setIconValue([color, icon])
    setPopoverShow(false)
  }


  const columns = [
    {
      title: '名称',
      dataIndex: 'text',
      width: '25%',
      render(dom, entity) {
        if(!entity.icon) return(<></>)
        return (
          <Tag color={entity?.icon[0]} icon={<IconFont type={entity?.icon[1]} />}>{entity.text}</Tag>
        )
      }
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: '25%',
      // renderFormItem() {
      //   return <Popover trigger="click" placement='right' open={popoverShow} content={
      //     <>
      //       {
      //         Object.keys(iconList).map(item => (
      //           <>
      //             <Divider orientation="left" orientationMargin={0} style={{ fontSize: '12px' }}>{item}</Divider>
      //             <Space size='large'>
      //               {
      //                 iconList[item]['icon'].map(icon => (
      //                   <a className="icon-link" onClick={() => handleClick(iconList[item]['color'], icon)}><IconFont type={icon} style={{ fontSize: '24px' }} /></a>
      //                 ))
      //               }
      //             </Space>
      //           </>
      //         ))
      //       }
      //     </>
      //   }>
      //     <a onClick={() => setPopoverShow(true)}>
      //       {
      //         iconValue.length ? <IconFont type={iconValue[1]} style={{ fontSize: '24px' }} /> : '选择图标'
      //       }
      //     </a>
      //   </Popover >
      // },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a key="editable" onClick={() => {
          console.log(record, action)
          var _a;
          (_a = action === null || action === void 0 ? void 0 : action.startEditable) === null || _a === void 0 ? void 0 : _a.call(action, record.id);
        }}>编辑</a>,
        <a key="delete" onClick={() => {
          setIsSpinning(true)
          fetch('http://127.0.0.1:8800/ledger/tags/delete_one:id', {
            method: 'POST',
            body: JSON.stringify({
              id: record._id
            })
          })
            .then(data => {
              setIsSpinning(false)
              message.success(`Delete id:${record._id} success!`, 5);
              props.onRefreshClassificationTags()
            });
        }}>删除</a>,
      ],
    },
  ];

  return (
    <Modal maskClosable={false} title="Tags Table" width="600px" open={props.showLedgerTagsManageModal} onOk={() => props.onShowLedgerTagsManageModal(true)} onCancel={() => props.onShowLedgerTagsManageModal(false)}>
      <Spin spinning={isSpinning}>
        <EditableProTable loading={false} rowKey="id" dataSource={props.classificationTags} value={dataSource} onChange={setDataSource} maxLength={20} columns={columns}
          recordCreatorProps={position !== 'hidden' ? {
            position: position,
            record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
          } : false}
          toolBarRender={() => []}
          request={async () => ({
            data: props.classificationTags,
            total: 3,
            success: true,
          })}
          editable={{
            type: 'multiple',
            editableKeys,
            onSave: async (rowKey, data, row) => {
              fetch('http://127.0.0.1:8800/ledger/tags/insert_one', {
                method: 'POST',
                body: JSON.stringify({
                  text: data.text,
                  icon: iconValue
                })
              })
                .then(response => response.json())
                .then(data => {
                  props.onRefreshClassificationTags()
                });
            },
            onChange: setEditableRowKeys,
          }} />
      </Spin>
    </Modal>
  );
};

export default LedgerTagsManageModal