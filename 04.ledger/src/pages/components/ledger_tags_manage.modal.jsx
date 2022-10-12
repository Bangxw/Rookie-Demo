import { Modal, Spin, message, Tag, Row, Col, Divider, Space, Input, Card, Tabs, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { ICONFONT_URL } from '@/const'

const IconFont = createFromIconfontCN({
  scriptUrl: [ICONFONT_URL,],
});


const iconList = {
  '饮食': ['icon-fastfood', 'icon-cooking', 'icon-fruit', 'icon-snacks',],
  '消费': ['icon-clothing', 'icon-daily',],
  '交通': ['icon-bus', 'icon-taxi', 'icon-plane',],
  '家庭支出': ['icon-rent', 'icon-comm', 'icon-badminton',],
  '其它': ['icon-unknown'],
}

const Category = [
  { text: '饮食', color: '#F5222D' },
  { text: '消费', color: '#FADB14' },
  { text: '交通', color: '#52C41A' },
  { text: '家庭支出', color: '#13C2C2' },
  { text: '其它', color: '#13C2C2' },
]


const LedgerTagsManageModal = props => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [showIndex, setShowIndex] = useState('-1,-1');
  const [operateName, setOperateName] = useState('');
  const [operateIcon, setOperateIcon] = useState('');
  const [operateCategory, setOperateCategory] = useState(Category[0].text);
  const [ledgerSubTypesByCategory, setLedgerSubTypesByCategory] = useState({})

  const handleDelete = (id) => {
    setIsSpinning(true)
    fetch('http://127.0.0.1:8800/ledger/sub_types/delete_one:id', {
      method: 'POST',
      body: JSON.stringify({
        id: id
      })
    })
      .then(data => {
        setIsSpinning(false)
        message.success(`Delete id:${id} success!`, 5);
        props.onRefreshledgerSubTypes()
      });
  }

  const AddEditSubType = item => {
    setOperateIcon(item ? item.icon : '')
    setOperateName(item ? item.text : '')
    setEditModal(true)
  }

  const handleApply = () => {
    fetch('http://127.0.0.1:8800/ledger/sub_types/insert_one', {
      method: 'POST',
      body: JSON.stringify({
        text: operateName,
        icon: operateIcon,
        category: operateCategory
      })
    })
      .then(data => {
        message.success(`Create new item success!`, 5);
        props.onRefreshledgerSubTypes()
      });
  }

  useEffect(() => {
    let SubTypeByCategory = {}
    Category.forEach(item => {
      if (!(item.text in SubTypeByCategory)) SubTypeByCategory[item.text] = []
    })
    props.ledgerSubTypes.forEach(item => {
      SubTypeByCategory[item.category].push(item)
    })
    setLedgerSubTypesByCategory(SubTypeByCategory)
  }, props.ledgerSubTypes);

  return (
    <>
      <Card type="inner" bordered={false}>
        <Spin spinning={isSpinning}>
          <Tabs tabPosition='left' activeKey={operateCategory}
            // tabBarExtraContent={<Button>+</Button>}
            onChange={activeKey => setOperateCategory(activeKey)}
            items={Category.map((_, i) => {
              return {
                label: _.text,
                key: _.text,
                children: <div className='category-fields'>
                  <Space size='small'>
                    {
                      Array.isArray(ledgerSubTypesByCategory[_.text]) &&
                      ledgerSubTypesByCategory[_.text].map((s, sIndex) => (
                        <Tag className='category-sub-tag' color={_.color} key={sIndex}
                          onMouseEnter={() => setShowIndex(`${i},${sIndex}`)}
                          onMouseLeave={() => setShowIndex('-1,-1')}
                        >
                          <div className='mask-layer' hidden={showIndex === `${i},${sIndex}` ? false : true} >
                            <IconFont type='icon-edit' className='operation-icon' onClick={() => AddEditSubType(s)} />
                            <IconFont type='icon-delete' className='operation-icon' onClick={() => handleDelete(s._id)} />
                          </div>
                          <IconFont type={s.icon} style={{ fontSize: '24px', marginLeft: '5px' }} />
                          {s.text}
                        </Tag>
                      ))
                    }
                  </Space>

                  <Button type="primary" onClick={() => AddEditSubType()} className='mb-4'>新增</Button>
                </div>,
              };
            })}
          />
        </Spin>
      </Card>


      <Modal maskClosable={false} open={editModal} closable={false} okText='Apply'
        onOk={() => handleApply(true)}
        onCancel={() => setEditModal(false)}
      >
        <Row>
          <Col>名称：</Col>
          <Col><Input showCount maxLength={20} value={operateName} onChange={e => setOperateName(e.target.value)} /></Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col>图标：</Col>
          <Col style={{ border: '1px dotted #ccc', padding: '5px 10px' }}>
            {
              <Space size='large'>
                {
                  iconList[operateCategory].map((icon, index) => (
                    <IconFont key={index + 1} type={icon}
                      style={{ fontSize: '24px' }}
                      className={`block-icon-link ${icon === operateIcon ? 'active' : ''}`}
                      onClick={() => setOperateIcon(icon)}
                    />
                  ))
                }
              </Space>
            }
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default LedgerTagsManageModal