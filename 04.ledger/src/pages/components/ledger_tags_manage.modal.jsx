import { Modal, Spin, message, Tag, Row, Col, Divider, Space, Input, Card, Tabs, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { ICONFONT_URL } from '@/const'

const IconFont = createFromIconfontCN({
  scriptUrl: [ICONFONT_URL,],
});

const iconList = {
  '饮食': ['icon-fastfood', 'icon-cooking', 'icon-fruits', 'icon-snacks', 'icon-snacks', 'icon-snacks'],
  '消费': ['icon-clothing', 'icon-daily',],
  '交通': ['icon-bus', 'icon-taxi', 'icon-plane',],
  '休闲': ['icon-switch', 'icon-badminton'],
  '家庭支出': ['icon-house-rent', 'icon-red-envelope', 'icon-family'],
  '其它': ['icon-unknown'],
}

const LedgerTagsManageModal = props => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [showIndex, setShowIndex] = useState('-1,-1');
  const [operateName, setOperateName] = useState('');
  const [operateIcon, setOperateIcon] = useState('');
  const [operateCategory, setOperateCategory] = useState('');
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
        setEditModal(false)
      });
  }

  useEffect(() => {
    let SubTypeByCategory = {}
    props.ledgerCategory.forEach(item => {
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
          <Tabs tabPosition='left' className='category-ant-tabs' activeKey={operateCategory}
            tabBarExtraContent={<Button type="dashed" onClick={() => AddEditSubType()}>Add+</Button>}
            onChange={activeKey => setOperateCategory(activeKey)}
            items={props.ledgerCategory.map((_, i) => {
              return {
                label: _.text,
                key: _.text,
                children:
                  <div className='category-fields'>
                    {
                      Array.isArray(ledgerSubTypesByCategory[_.text]) &&
                      ledgerSubTypesByCategory[_.text].map((s, sIndex) => (
                        <div className='category-sub-tags' key={sIndex}
                          onMouseEnter={() => setShowIndex(`${i},${sIndex}`)}
                          onMouseLeave={() => setShowIndex('-1,-1')}
                        >
                          <div className='mask-layer' hidden={showIndex === `${i},${sIndex}` ? false : true} >
                            <IconFont type='icon-edit' className='operation-icon' onClick={() => AddEditSubType(s)} />
                            <IconFont type='icon-delete' className='operation-icon' onClick={() => handleDelete(s._id)} />
                          </div>
                          <div className='icon-twrap'>
                            <IconFont type={s.icon} style={{ fontSize: '36px' }} />
                            <span>{s.text}</span>
                          </div>
                        </div>
                      ))
                    }
                  </div>,
              };
            })}
          />
        </Spin>
      </Card>


      <Modal maskClosable={false} open={editModal} closable={false} okText='Apply' width={400}
        onOk={() => handleApply(true)}
        onCancel={() => setEditModal(false)}
      >
        <table className='tags-operate-table'>
          <tr>
            <td>名称：</td>
            <td><Input showCount maxLength={20} value={operateName} onChange={e => setOperateName(e.target.value)} /></td>
          </tr>
          <tr>
            <td>图标：</td>
            <td>
              <div className='icons-collection clearfix'>
                {
                  iconList[operateCategory].map((icon, index) => (
                      <IconFont key={index + 1} type={icon}
                        style={{ fontSize: '32px' }}
                        className={`block-icon-link ${icon === operateIcon ? 'activied' : ''}`}
                        onClick={() => setOperateIcon(icon)}
                      />
                  ))
                }
              </div>
            </td>
          </tr>
        </table>
      </Modal>
    </>
  );
};

export default LedgerTagsManageModal