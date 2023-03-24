import React, { useState } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import {
  Modal, Tabs, message, Spin, Input,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ICON_LIST } from '@src/const';
import { fetch_plus } from '@utils/common';
import { ledgerCategoryProptypes, ledgerSubtypesProptypes } from '@utils/proptypes.config';
import * as actions from '@redux/actions';
import IconFont from '@components/iconfont';

// 按category分组
function grouped_subtypes_by_category(data) {
  return data.reduce((acc, item) => {
    if (acc[item.category]) acc[item.category].push(item);
    else acc[item.category] = [item];
    return acc;
  }, []);
}

function SubtypesManage({
  ledgerCategory,
  ledgerSubtypes,
  fetch_ledger_subtypes_data,
  showSubtypeManageModal,
  handle_show_subtype_manage_modal,
  setCategoryManageModal,
  handle_app_spinning,
}) {
  const [activeTabKey, setActiveTabKey] = useState(localStorage.getItem('defaultActiveTabKey') || ledgerCategory[0]?.key); // 用category的key作为tabs的key
  const [subtypeSchema, setSubtypeSchema] = useState({ key: -1, text: '', icon: '' });
  const [activeSubtypeAxis, setActiveSubtypeAxis] = useState('-1,-1'); // 记录当前操作的图标坐标
  const [subtypeAddEditModal, setSubtypeAddEditModal] = useState(false);
  const [subtypeAddEditModalSpinning, setSubtypeAddEditModalSpinning] = useState(false);
  const groupedSubtypes = grouped_subtypes_by_category(ledgerSubtypes);

  const handleTabsChange = (tabKey) => {
    setActiveTabKey(tabKey);
    localStorage.setItem('defaultActiveTabKey', tabKey);
  };

  const handleAddEditSubtype = (item) => {
    setSubtypeSchema(item || { key: -1, text: '', icon: '' });
    setSubtypeAddEditModal(true);
  };

  const fetchDeleteSubtype = (key) => {
    Modal.confirm({
      content: '确认删除？',
      icon: <DeleteOutlined />,
      title: 'Confirm',
      onOk: () => {
        handle_app_spinning(true);
        fetch_plus(`/ledger/subtype/${key}`, {
          method: 'DELETE',
        }).then((response) => {
          handle_app_spinning(false);
          if (response.status === 1) {
            fetch_ledger_subtypes_data().then(() => {
              message.success(response.message);
            });
          } else {
            message.error(response.message);
          }
        });
      },
    });
  };

  const fetchAddEditSubtype = () => {
    if (!subtypeSchema.text) { message.warning('请输入类别名称', 5); return; }
    if (!subtypeSchema.icon) { message.warning('请选择一个图标', 5); return; }

    // subtypeSchema.key === -1 => 新增一项，否则就是编辑指定key的subtypes
    const url = subtypeSchema.key === -1 ? '/ledger/subtype' : `/ledger/subtype/${subtypeSchema.key}`;
    const method = subtypeSchema.key === -1 ? 'POST' : 'PUT';

    setSubtypeAddEditModalSpinning(true);
    fetch_plus(url, {
      method,
      body: JSON.stringify({
        text: subtypeSchema.text,
        icon: subtypeSchema.icon,
        category: activeTabKey,
      }),
    }).then((response) => {
      setSubtypeAddEditModalSpinning(false);
      if (response.status === 1) {
        fetch_ledger_subtypes_data().then(() => {
          setSubtypeAddEditModal(false);
          message.success(response.message, 5);
        });
      } else {
        message.error(response.message, 5);
      }
    });
  };

  return (
    <>
      {/* 按category分组展示subtypes */}
      <Modal
        width={800}
        closeable={false}
        maskClosable={false}
        open={showSubtypeManageModal}
        onCancel={() => handle_show_subtype_manage_modal(false)}
      >
        <Tabs
          tabPosition="left"
          className="category-ant-tabs"
          activeKey={activeTabKey}
          onChange={handleTabsChange}
          tabBarExtraContent={(
            <span aria-hidden="true" className="category-control-button" onClick={() => { setCategoryManageModal(true); }}>
              <IconFont type="icon-setting" />
            </span>
          )}
          items={
            ledgerCategory.map((item, index) => ({
              label: item.text,
              key: item.key,
              children: (
                <div className="subtype-fields">
                  {
                    (groupedSubtypes[item.key] || []).map((_, i) => (
                      <div
                        className="subtype"
                        key={_.key}
                        onMouseEnter={() => setActiveSubtypeAxis(`${index},${i}`)}
                        onMouseLeave={() => setActiveSubtypeAxis('-1,-1')}
                      >
                        <div className="mask-layer" hidden={activeSubtypeAxis !== `${index},${i}`}>
                          <IconFont type="icon-edit" className="operation-icon" onClick={() => handleAddEditSubtype(_)} />
                          <IconFont type="icon-delete" className="operation-icon" onClick={() => fetchDeleteSubtype(_.key)} />
                        </div>
                        <div className="icon-wrap">
                          <IconFont type={_.icon || ' '} style={{ fontSize: '36px' }} />
                          <span>{_.text}</span>
                        </div>
                      </div>
                    ))
                  }
                  <div className="subtype" onClick={() => handleAddEditSubtype()} aria-hidden="true">
                    <div className="add-new-subtag">
                      <IconFont type="icon-add" style={{ fontSize: '24px' }} />
                    </div>
                  </div>
                </div>
              ),
            }))
          }
        />
      </Modal>

      {/* 新增和编辑subtype */}
      <Modal
        maskClosable={false}
        closable={false}
        okText="Apply"
        width={400}
        open={subtypeAddEditModal}
        onOk={() => fetchAddEditSubtype(true)}
        onCancel={() => setSubtypeAddEditModal(false)}
      >
        <Spin tip="Loading..." spinning={subtypeAddEditModalSpinning}>
          <table className="subtype-operate-table">
            <tbody>
              <tr>
                <td>名称：</td>
                <td>
                  <Input
                    showCount
                    maxLength={20}
                    aria-hidden="true"
                    value={subtypeSchema.text}
                    onChange={(e) => setSubtypeSchema({ ...subtypeSchema, text: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td>图标：</td>
                <td>
                  <div className="icons-collection clearfix">
                    {
                      ICON_LIST.map((icon) => (
                        <IconFont
                          key={icon}
                          type={icon || ' '}
                          style={{ fontSize: '32px' }}
                          className={`block-icon-link ${icon === subtypeSchema.icon ? 'active' : ''}`}
                          onClick={() => setSubtypeSchema({ ...subtypeSchema, icon })}
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
}
SubtypesManage.propTypes = {
  ...ledgerCategoryProptypes,
  ...ledgerSubtypesProptypes,
  fetch_ledger_subtypes_data: PropTypes.func.isRequired,
  showSubtypeManageModal: PropTypes.bool.isRequired,
  handle_show_subtype_manage_modal: PropTypes.func.isRequired,
  setCategoryManageModal: PropTypes.func.isRequired,
  handle_app_spinning: PropTypes.func.isRequired,
};
export default connect((state) => ({
  ledgerCategory: state.ledgerCategory,
  ledgerSubtypes: state.ledgerSubtypes,
  showSubtypeManageModal: state.showSubtypeManageModal,
}), {
  fetch_ledger_subtypes_data: actions.fetch_ledger_subtypes_data,
  handle_show_subtype_manage_modal: actions.handle_show_subtype_manage_modal,
  handle_app_spinning: actions.handle_app_spinning,
})(SubtypesManage);
