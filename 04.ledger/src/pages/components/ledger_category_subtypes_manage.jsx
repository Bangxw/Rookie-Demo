import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Modal, Spin, message, Input, Card, Tabs, Button, Popconfirm } from 'antd';
import { createFromIconfontCN, DeleteOutlined } from '@ant-design/icons';

import { set_app_spinning, get_ledger_subtypes } from '@redux/actions'
import { ICONFONT_URL, ICON_LIST } from '@/const'



const IconFont = createFromIconfontCN({ scriptUrl: [ICONFONT_URL,], })
const CategoryOfSubtypes = {}

const LedgerCategorySubtypesManage = props => {
  const [showSpinning, setShowSpinning] = useState(false);
  const [addEditModal, setAddEditModal] = useState(false);
  const [showIndex, setShowIndex] = useState('-1,-1');
  const [operateSubtypeID, setOperateSubtypeID] = useState(-1); // 当前操作-交易类型的ID
  const [operateSubtypeName, setOperateSubtypeName] = useState(''); // 交易类型名称
  const [operateSubtypeIcon, setOperateSubtypeIcon] = useState(''); // 交易类型图标
  const [operateCategory, setOperateCategory] = useState(localStorage.getItem('defaultOperateCategory') || props.ledgerCategory[0].text);
  const [ledgerCategoryOfSubtypes, setLedgerCategoryOfSubtypes] = useState({})

  useEffect(() => {
    props.ledgerCategory.forEach(item => {
      CategoryOfSubtypes[item.text] = { color: item.color, subtypes: [] }
    })
    props.ledgerSubTypes.forEach(item => {
      CategoryOfSubtypes[item.category].subtypes.push(item)
    })
    setLedgerCategoryOfSubtypes(CategoryOfSubtypes)
  });

  const handleOperateSubtype = () => {
    setShowSpinning(true)
    let url = 'http://127.0.0.1:8800/ledger/sub_types/insert_one';
    let data = {
      text: operateSubtypeName,
      icon: operateSubtypeIcon,
      category: operateCategory
    }
    if (operateSubtypeID !== -1) {  // 当前为编辑 subtype
      url = 'http://127.0.0.1:8800/ledger/sub_types/update_one:id'
      data = {
        id: operateSubtypeID,
        data
      }
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(data => {
      props.get_ledger_subtypes().then(() => {
        setShowSpinning(false)
        setAddEditModal(false)
        if (operateSubtypeID === -1) message.success(`Create new item success!`, 5);
        else message.success(`Edit item success!`, 5);
      })
    });
  }

  const handleDeleteSubtype = id => {
    Modal.confirm({
      title: 'Confirm',
      icon: <DeleteOutlined />,
      content: '确认删除？',
      onOk: () => {
        props.set_app_spinning(true)
        fetch('http://127.0.0.1:8800/ledger/sub_types/delete_one:id', {
          method: 'POST',
          body: JSON.stringify({
            id: id
          })
        })
          .then(data => {
            props.get_ledger_subtypes().then(() => {
              props.set_app_spinning(false)
              message.success(`Delete ID: ${id} Success!`, 5);
            })
          });
      }
    });
  }

  const openEditModal = item => {
    setOperateSubtypeIcon(item ? item.icon : '')
    setOperateSubtypeName(item ? item.text : '')
    setOperateSubtypeID(item ? item._id : -1)
    setAddEditModal(true)
  }

  const handleTabsChange = (activeKey) => {
    setOperateCategory(activeKey)
    localStorage.setItem('defaultOperateCategory', activeKey)
  }

  return (
    <>
      <Card type="inner" bordered={false}>
        <Tabs tabPosition='left' className='category-ant-tabs'
          activeKey={operateCategory}
          tabBarExtraContent={<Button type="primary" onClick={() => openEditModal()}>Add+</Button>}
          onChange={handleTabsChange}
          items={
            Object.keys(ledgerCategoryOfSubtypes).map((category, index) => ({
              label: category,
              key: category,
              children: <div className='category-fields'>
                {
                  ledgerCategoryOfSubtypes[category].subtypes.map((_, i) => (
                    <div className='category-sub-tags' key={i}
                      onMouseEnter={() => setShowIndex(`${index},${i}`)}
                      onMouseLeave={() => setShowIndex('-1,-1')}
                    >
                      <div className='mask-layer' hidden={showIndex === `${index},${i}` ? false : true} >
                        <IconFont type='icon-edit' className='operation-icon' onClick={() => openEditModal(_)} />
                        <IconFont type='icon-delete' className='operation-icon' onClick={() => handleDeleteSubtype(_._id)} />
                      </div>
                      <div className='icon-twrap'>
                        <IconFont type={_.icon} style={{ fontSize: '36px' }} />
                        <span>{_.text}</span>
                      </div>
                    </div>
                  ))
                }
              </div>,
            }))
          }
        />
      </Card>

      <Modal maskClosable={false} open={addEditModal} closable={false} okText='Apply' width={400}
        onOk={() => handleOperateSubtype(true)}
        onCancel={() => setAddEditModal(false)}
      >
        <Spin tip="Loading..." spinning={showSpinning}>
          <table className='tags-operate-table'>
            <tbody>
              <tr>
                <td>名称：</td>
                <td><Input showCount maxLength={20} value={operateSubtypeName} onChange={e => setOperateSubtypeName(e.target.value)} /></td>
              </tr>
              <tr>
                <td>图标：</td>
                <td>
                  <div className='icons-collection clearfix'>
                    {
                      ICON_LIST[operateCategory].map((icon, index) => (
                        <IconFont key={index + 1} type={icon}
                          style={{ fontSize: '32px' }}
                          className={`block-icon-link ${icon === operateSubtypeIcon ? 'activied' : ''}`}
                          onClick={() => setOperateSubtypeIcon(icon)}
                        />
                      ))
                    }
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Spin>
      </Modal>
    </>
  );
};

export default connect(
  state => ({
    ledgerCategory: state.ledgerCategory,
    ledgerSubTypes: state.ledgerSubTypes,
    appSpinning: state.appSpinning
  }),
  { set_app_spinning, get_ledger_subtypes }
)(LedgerCategorySubtypesManage);