import { Modal, Spin, message, Tag, Popover, Row, Col, Button, Popconfirm, Divider } from 'antd';
import { EditableProTable, ProCard, ProFormField, ProFormRadio } from '@ant-design/pro-components';
import React, { useState } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { SketchPicker } from 'react-color';
import ICONFONT_URL from '../const'

const IconFont = createFromIconfontCN({
  scriptUrl: [ICONFONT_URL,],
});

const valueEnum = {}
const iconList = [
  'icon-cooking',
  'icon-plane',
  'icon-daily',
  'icon-rent',
  'icon-bus',
  'icon-fruit',
  'icon-taxi',
  'icon-badminton',
  'icon-clothing',
  'icon-subway',
  'icon-snacks',
  'icon-comm',
  'icon-fastfood',
]
iconList.forEach((item, index) => {
  valueEnum[item] = { text: item, key: index }
})


const LedgerTagsManageModal = props => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState(props.classificationTags);
  const [position, setPosition] = useState('bottom');
  const [subtitleColor, setSubtitleColor] = useState('#f0f0f0');
  const [selectIcon, setSelectIcon] = useState('');
  const [popoverShow, setPopoverShow] = useState(false);
  const [popoverShow1, setPopoverShow1] = useState(false);

  console.log(dataSource)

  const handleClick = (item) => {
    setSelectIcon(item);
    setPopoverShow1(false)
  }

  const columns = [
    {
      title: '展示',
      dataIndex: 'text',
      width: '25%',
      render(dom, entity) {
        return (
          <Tag color={entity.color} icon={<IconFont type={entity.icon} />}>{entity.text}</Tag>
        )
      }
    },
    {
      title: '色值',
      dataIndex: 'color',
      width: '25%',
      renderFormItem() {
        return <Popover trigger="click" content={
          // <SketchPicker
          //   color={subtitleColor}
          //   disableAlpha={false}
          //   width={250}
          //   onChange={(e) => { setSubtitleColor(e.hex) }}
          //   onChangeComplete={(e) => { setSubtitleColor(e.hex); setPopoverShow(false) }}
          // />
          <>
            <Divider orientation="left">Left Text</Divider>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
              probare, quae sunt a te dicta? Refert tamen, quo modo.
            </p>
          </>
        }>
          {/* <div className="color-set-field" onClick={() => setPopoverShow(true)}>
            <div className="color-set-show" style={{ backgroundColor: subtitleColor }}></div>
            <div className="color-set-value">{subtitleColor}</div>
          </div> */}
          aaaa
        </Popover>
      },
    },
    {
      title: '标签类名',
      dataIndex: 'icon',
      width: '25%',
      renderFormItem() {
        return (<></>)

        // return <Popover trigger="click" open={popoverShow1} content={
        //   <Row gutter={[16, 16]}>{
        //     iconList.map((item, index) => (
        //       <Col span={6} key={index} style={{ fontSize: '18px' }} onClick={() => handleClick(item)} className="icon-class"><IconFont type={item} /></Col>
        //     ))
        //   }
        //   </Row>
        // }>
        //   <Button type="link" size="small" onClick={() => setPopoverShow1(true)}>图示</Button>
        // </Popover>
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a key="editable" onClick={() => {
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
    <Modal title="Tags Table" width="600px" open={props.showLedgerTagsManageModal} onOk={() => props.onShowLedgerTagsManageModal(true)} onCancel={() => props.onShowLedgerTagsManageModal(false)}>
      <Spin spinning={isSpinning}>
        <EditableProTable loading={false} rowKey="id" dataSource={props.classificationTags} value={dataSource} onChange={setDataSource} maxLength={20} columns={columns}
          recordCreatorProps={position !== 'hidden' ? {
            position: position,
            record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
          } : false}
          toolBarRender={() => []}
          // request={async () => ({
          //   data: props.classificationTags,
          //   total: 3,
          //   success: true,
          // })}
          editable={{
            type: 'multiple',
            editableKeys,
            onSave: async (rowKey, data, row) => {
              console.log(data, row, subtitleColor)
              fetch('http://127.0.0.1:8800/ledger/tags/insert_one', {
                method: 'POST',
                body: JSON.stringify({
                  text: data.text,
                  color: subtitleColor,
                  icon: selectIcon
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