import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import {
  Modal, Spin, message, Input, Tabs, List, Popconfirm,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { handle_app_spinning, get_ledger_subtypes, get_ledger_category } from '@redux/actions';
import { ICON_FONT as IconFont, ICON_LIST } from '@/const';

// 大分类的配置
function CategoryConfig(props) {
  const addInputRef = useRef();
  const editInputRef = useRef();

  const [spinning, setSpinning] = useState(false);
  const [operatingStatus, setOperatingStatus] = useState('IDLE'); // "ADDING" | "EDITING:[ID]" | IDLE
  const [categoryText, setCategoryText] = useState('');

  const {
    ledgerCategory,
    categoryControlModal,
    ledgerSubTypes,
    handleGetLedgerCategroy,
    setCategoryControlModal,
  } = props;

  const handleDeleteCategory = (id, text) => {
    const hasSubtype = ledgerSubTypes.some((item) => item.category === text);
    if (hasSubtype) {
      message.error('当前Category还有Subtype，请先将其清空再重试', 5);
      return;
    }

    setSpinning(true);
    fetch('http://127.0.0.1:8800/ledger/category/delete_one:id', {
      body: JSON.stringify({
        id,
      }),
      method: 'POST',
    }).then((response) => response.json())
      .then((response) => {
        handleGetLedgerCategroy().then(() => {
          setSpinning(false);
          message.success(response.message, 5);
        });
      });
  };

  const handleOperateCategory = (id) => {
    let url = 'http://127.0.0.1:8800/ledger/category/insert';
    let data = { text: categoryText };

    if (id) {
      url = 'http://127.0.0.1:8800/ledger/category/update_one:id';
      data = { data, id };
    }

    setSpinning(true);
    fetch(url, {
      body: JSON.stringify(data),
      method: 'POST',
    }).then((response) => response.json())
      .then((response) => {
        handleGetLedgerCategroy().then(() => {
          setOperatingStatus('IDLE');
          setCategoryText('');
          setSpinning(false);
          message.success(response.message, 5);
        });
      });
  };

  const handleBtnAdd = () => {
    if (operatingStatus === 'ADDING') {
      addInputRef.current?.focus();
      return;
    }
    if (operatingStatus.includes('EDITING')) {
      message.warning('请先完成编辑', 3);
      editInputRef.current?.focus();
      return;
    }
    setOperatingStatus('ADDING');
  };

  const handleBtnEdit = (id, text) => {
    if (operatingStatus === 'ADDING') {
      message.warning('请先完成新增', 3);
      addInputRef.current?.focus();
      return;
    }
    setOperatingStatus(`EDITING:${id}`);
    setCategoryText(text);
  };

  return (
    <Modal
      maskClosable={false}
      closable={false}
      okText="Add"
      width={300}
      open={categoryControlModal}
      onOk={() => { handleBtnAdd(); }}
      onCancel={() => { setCategoryControlModal(false); setOperatingStatus(''); }}
    >
      <Spin tip="Loading..." spinning={spinning}>
        <List
          size="small"
          bordered
          dataSource={ledgerCategory}
          renderItem={(item, index) => (
            <List.Item className="category-list-item font-13">
              {
                operatingStatus.includes('EDITING') && operatingStatus.indexOf(item.key) > -1 ? ( // 当前项处于编辑状态
                  <>
                    <span className="mr-2">
                      {index + 1}
                      .
                    </span>
                    <Input
                      size="small"
                      className="font-13"
                      ref={editInputRef}
                      value={categoryText}
                      onChange={(e) => setCategoryText(e.target.value)}
                      suffix={<IconFont type="icon-ok" className="btn-ok" onClick={() => handleOperateCategory(item.key)} />}
                    />
                    <IconFont type="icon-cancel" className="ml-3 mr-1 btn-cancel" onClick={() => { setOperatingStatus('IDLE'); setCategoryText(''); }} />
                  </>
                ) : ( // 进行列表展示
                  <>
                    <div>
                      <span className="mr-2">
                        {index + 1}
                        .
                      </span>
                      {item.text}
                    </div>
                    <div className="item-operate font-18">
                      <IconFont type="icon-edit" className="text-success" onClick={() => { handleBtnEdit(item.key, item.text); }} />
                      <Popconfirm
                        title="Are you sure to delete this task?"
                        onConfirm={() => handleDeleteCategory(item.key, item.text)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <IconFont type="icon-delete" className="text-danger" />
                      </Popconfirm>
                    </div>
                  </>
                )
              }
            </List.Item>
          )}
        >
          {
            operatingStatus === 'ADDING' ? ( // 新增条目
              <List.Item className="category-list-item font-13">
                <span className="mr-2">
                  {ledgerCategory.length + 1}
                  .
                </span>
                <Input
                  size="small"
                  className="font-13"
                  ref={addInputRef}
                  value={categoryText}
                  onChange={(e) => setCategoryText(e.target.value)}
                  suffix={<IconFont type="icon-ok" className="btn-ok" onClick={() => handleOperateCategory()} />}
                />
                <IconFont type="icon-cancel" className="ml-3 mr-1 btn-cancel" onClick={() => { setOperatingStatus('IDLE'); setCategoryText(''); }} />
              </List.Item>
            ) : ''
          }
        </List>
      </Spin>
    </Modal>
  );
}

// 小分类的管理
function CategorySubtypesManage(props) {
  const {
    ledgerCategory,
    ledgerSubTypes,
    showSubtypeManageModal,
    onShowSubtypeManageModal,
    get_ledger_category: get_ledger_category_data,
    get_ledger_subtypes: get_ledger_subtypes_data,
    handle_app_spinning: handle_app_spingning_status, // 控制spinning展示
  } = props;

  const [activeTabKey, setActiveTabKey] = useState(localStorage.getItem('defaultActiveTabKey') || ledgerCategory[0]?.key); // 用Category的id作为tabs的key
  const [showIndex, setShowIndex] = useState('-1,-1');

  const [subtypeAddEditModal, setAddEditModal] = useState(false);
  const [subtypeAddEditModalSpinning, setSubtypeAddEditModalSpinning] = useState(false);
  const [activeSubtypeID, setActiveSubtypeID] = useState(-1); // 当前操作-交易类型的ID
  const [activeSubtypeName, setActiveSubtypeName] = useState(''); // 交易类型名称
  const [activeSubtypeIcon, setActiveSubtypeIcon] = useState(''); // 交易类型图标

  const [categoryControlModal, setCategoryControlModal] = useState(false);

  const fetchDeleteSubtype = (id) => {
    Modal.confirm({
      content: '确认删除？',
      icon: <DeleteOutlined />,
      title: 'Confirm',
      onOk: () => {
        handle_app_spingning_status(true);
        fetch('http://127.0.0.1:8800/ledger/sub_types/delete_one:id', {
          method: 'POST',
          body: JSON.stringify({
            id,
          }),
        }).then((response) => response.json())
          .then((response) => {
            get_ledger_subtypes().then(() => {
              handle_app_spingning_status(false);
              message.success(response.message);
            });
          });
      },
    });
  };

  const fetchAddEditSubtype = () => {
    if (!activeSubtypeName) { message.warning('请输入类别名称', 5); return; }
    if (!activeSubtypeIcon) { message.warning('请选择一个图标', 5); return; }

    let url = 'http://127.0.0.1:8800/ledger/sub_types/insert';
    let data = {
      text: activeSubtypeName,
      icon: activeSubtypeIcon,
      categoryID: activeTabKey,
    };

    if (activeSubtypeID !== -1) { // 当前为编辑 subtype
      url = 'http://127.0.0.1:8800/ledger/sub_types/update_one:id';
      data = {
        id: activeSubtypeID,
        data,
      };
    }

    setSubtypeAddEditModalSpinning(true);
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    }).then((response) => response.json())
      .then((response) => {
        get_ledger_subtypes_data().then(() => {
          setSubtypeAddEditModalSpinning(false);
          setAddEditModal(false);
          message.success(response.message, 5);
        });
      });
  };

  const handleTabsChange = (tabKey) => {
    setActiveTabKey(tabKey);
    localStorage.setItem('defaultActiveTabKey', tabKey);
  };

  const openSubtypeOperateModal = (item) => {
    setActiveSubtypeIcon(item ? item.icon : '');
    setActiveSubtypeName(item ? item.text : '');
    setActiveSubtypeID(item ? item.key : -1);
    setAddEditModal(true);
  };

  return (
    <Modal
      width={800}
      closable={false}
      maskClosable={false}
      open={showSubtypeManageModal}
      onCancel={() => onShowSubtypeManageModal(false)}
    >
      <Tabs
        tabPosition="left"
        className="category-ant-tabs"
        activeKey={activeTabKey}
        onChange={handleTabsChange}
        tabBarExtraContent={(
          <span className="category-control-button" onClick={() => { setCategoryControlModal(true); }} aria-hidden="true">
            <IconFont type="icon-setting" />
          </span>
        )}
        items={
          ledgerCategory.map((item, index) => ({
            label: item.text,
            key: item.key,
            children: (
              <div className="subtype-fields">
                {ledgerSubTypes.filter(
                  (record) => record.categoryID === activeTabKey,
                ).map((_, i) => (
                  <div
                    className="subtype"
                    key={_.key}
                    onMouseEnter={() => setShowIndex(`${index},${i}`)}
                    onMouseLeave={() => setShowIndex('-1,-1')}
                  >
                    <div className="mask-layer" hidden={showIndex !== `${index},${i}`}>
                      <IconFont type="icon-edit" className="operation-icon" onClick={() => openSubtypeOperateModal(_)} />
                      <IconFont type="icon-delete" className="operation-icon" onClick={() => fetchDeleteSubtype(_.key)} />
                    </div>
                    <div className="icon-wrap">
                      <IconFont type={_.icon || ' '} style={{ fontSize: '36px' }} />
                      <span>{_.text}</span>
                    </div>
                  </div>
                ))}
                <div className="subtype" onClick={() => openSubtypeOperateModal()} aria-hidden="true">
                  <div className="add-new-subtag">
                    <IconFont type="icon-add" style={{ fontSize: '24px' }} />
                  </div>
                </div>
              </div>),
          }))
        }
      />

      <Modal
        maskClosable={false}
        closable={false}
        okText="Apply"
        width={400}
        open={subtypeAddEditModal}
        onOk={() => fetchAddEditSubtype(true)}
        onCancel={() => setAddEditModal(false)}
      >
        <Spin tip="Loading..." spinning={subtypeAddEditModalSpinning}>
          <table className="subtype-operate-table">
            <tbody>
              <tr>
                <td>名称：</td>
                <td><Input showCount maxLength={20} value={activeSubtypeName} onChange={(e) => setActiveSubtypeName(e.target.value)} aria-hidden="true" /></td>
              </tr>
              <tr>
                <td>图标：</td>
                <td>
                  <div className="icons-collection clearfix">
                    {
                      ICON_LIST.map((icon) => (
                        <IconFont
                          type={icon || ' '}
                          key={icon}
                          style={{ fontSize: '32px' }}
                          className={`block-icon-link ${icon === activeSubtypeIcon ? 'active' : ''}`}
                          onClick={() => setActiveSubtypeIcon(icon)}
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

      <CategoryConfig
        ledgerCategory={ledgerCategory}
        ledgerSubTypes={ledgerSubTypes}
        handleGetLedgerCategroy={get_ledger_category_data}
        categoryControlModal={categoryControlModal}
        setCategoryControlModal={setCategoryControlModal}
      />
    </Modal>
  );
}

export default connect(
  (state) => ({
    ledgerCategory: state.ledgerCategory,
    ledgerSubTypes: state.ledgerSubTypes,
    appSpinning: state.appSpinning,
  }),
  { handle_app_spinning, get_ledger_subtypes, get_ledger_category },
)(CategorySubtypesManage);
