import React, { useState } from 'react';
import {
  Modal, Tabs, message, Spin, Input,
} from 'antd';
import { PropTypes } from 'prop-types';
import { DeleteOutlined } from '@ant-design/icons';
import { ICON_LIST, FETCH_URL } from '@src/const';
import { ledgerCategoryPropTypes, ledgerSubtypesPropTypes } from '@utils/proptypes.config';
import IconFont from '@components/iconfont';

export default function SubtypesManage({
  ledgerCategory,
  ledgerSubtypes,
  showSubtypeManageModal,
  onShowSubtypeManageModal,
  setCategoryManageModal,
  fetch_ledger_subtypes_data,
  handle_app_spinning,
}) {
  const [activeTabKey, setActiveTabKey] = useState(localStorage.getItem('defaultActiveTabKey') || ledgerCategory[0]); // 用category的key作为tabs的key
  const [subtypeAddEditModal, setSubtypeAddEditModal] = useState(false);
  const [activeSubtypeAxis, setActiveSubtypeAxis] = useState('-1,-1'); // 记录当前操作的图标坐标
  const [activeSubtypeID, setActiveSubtypeID] = useState(-1); // 当前操作-交易类型的ID
  const [activeSubtypeName, setActiveSubtypeName] = useState(''); // 交易类型名称
  const [activeSubtypeIcon, setActiveSubtypeIcon] = useState(''); // 交易类型图标
  const [subtypeAddEditModalSpinning, setSubtypeAddEditModalSpinning] = useState(false);

  const handleTabsChange = (tabKey) => {
    setActiveTabKey(tabKey);
    localStorage.setItem('defaultActiveTabKey', tabKey);
  };

  const handleAddEditSubtype = (item) => {
    setActiveSubtypeIcon(item ? item.icon : '');
    setActiveSubtypeName(item ? item.text : '');
    setActiveSubtypeID(item ? item.key : -1);
    setSubtypeAddEditModal(true);
  };

  const fetchDeleteSubtype = (id) => {
    Modal.confirm({
      content: '确认删除？',
      icon: <DeleteOutlined />,
      title: 'Confirm',
      onOk: () => {
        handle_app_spinning(true);
        fetch(`${FETCH_URL}/ledger/subtypes/delete_one:id`, {
          method: 'POST',
          body: JSON.stringify({
            id,
          }),
        }).then((response) => response.json())
          .then((response) => {
            fetch_ledger_subtypes_data().then(() => {
              handle_app_spinning(false);
              message.success(response.message);
            });
          });
      },
    });
  };

  const fetchAddEditSubtype = () => {
    if (!activeSubtypeName) { message.warning('请输入类别名称', 5); return; }
    if (!activeSubtypeIcon) { message.warning('请选择一个图标', 5); return; }

    let url = `${FETCH_URL}/ledger/subtypes/insert`;
    let data = {
      text: activeSubtypeName,
      icon: activeSubtypeIcon,
      categoryID: activeTabKey,
    };

    if (activeSubtypeID !== -1) { // 当前为编辑 subtype
      url = `${FETCH_URL}/ledger/subtypes/update_one:id`;
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
        fetch_ledger_subtypes_data().then(() => {
          setSubtypeAddEditModalSpinning(false);
          setSubtypeAddEditModal(false);
          message.success(response.message, 5);
        });
      });
  };

  return (
    <>
      <Modal
        width={800}
        closeable={false}
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
                    ledgerSubtypes
                      .filter((record) => record.categoryID === item.key)
                      .map((_, i) => (
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
    </>
  );
}
SubtypesManage.propTypes = {
  ...ledgerCategoryPropTypes,
  ...ledgerSubtypesPropTypes,
  showSubtypeManageModal: PropTypes.bool.isRequired,
  onShowSubtypeManageModal: PropTypes.func.isRequired,
  fetch_ledger_subtypes_data: PropTypes.func.isRequired,
  handle_app_spinning: PropTypes.func.isRequired,
};
