import React, { useState, useRef } from 'react';
import {
  Modal, message, Spin, List, Input, Popconfirm,
} from 'antd';
import { PropTypes } from 'prop-types';
import { fetch_plus } from '@utils/common';
import { ledgerCategoryPropTypes, ledgerSubtypesPropTypes } from '@utils/proptypes.config';
import IconFont from '@components/iconfont';

// 大分类的配置
export default function CategoryManage({
  ledgerCategory,
  ledgerSubtypes,
  categoryManageModal,
  setCategoryManageModal,
  handleGetLedgerCategroy,
}) {
  const addInputRef = useRef();
  const editInputRef = useRef();

  const [spinning, setSpinning] = useState(false); // waiting
  const [operatingStatus, setOperatingStatus] = useState('IDLE'); // "ADDING" | "EDITING:[ID]" | IDLE
  const [newCategoryText, setNewCategoryText] = useState('');

  const resetOperateStatus = () => {
    setOperatingStatus('IDLE');
    setNewCategoryText('');
  };

  const fetchDeleteCategory = (id, text) => {
    const hasSubtype = ledgerSubtypes.some((item) => item.category === text);
    if (hasSubtype) {
      message.error('当前Category还有Subtype，请先将其清空再重试', 5);
      return;
    }

    setSpinning(true);
    fetch_plus('/ledger/category/delete_one:id', {
      body: JSON.stringify({
        id,
      }),
      method: 'POST',
    })
      .then((response) => {
        handleGetLedgerCategroy().then(() => {
          setSpinning(false);
          message.success(response.message, 5);
        });
      });
  };

  const fetchInsertUpdateCategory = (id) => {
    let url = '/ledger/category/insert';
    let data = { text: newCategoryText };

    if (id) { // 编辑
      url = '/ledger/category/update_one:id';
      data = { data, id };
    }

    setSpinning(true);
    fetch_plus(url, {
      body: JSON.stringify(data),
      method: 'POST',
    })
      .then((response) => {
        handleGetLedgerCategroy().then(() => {
          resetOperateStatus();
          setSpinning(false);
          message.success(response.message, 5);
        });
      });
  };

  const addCategory = () => {
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

  const editCategory = (id, text) => {
    if (operatingStatus === 'ADDING') {
      message.warning('请先完成新增', 3);
      addInputRef.current?.focus();
      return;
    }
    setOperatingStatus(`EDITING:${id}`);
    setNewCategoryText(text);
  };

  return (
    <Modal
      maskClosable={false}
      closable={false}
      okText="Add"
      width={300}
      open={categoryManageModal}
      onOk={addCategory}
      onCancel={() => {
        resetOperateStatus();
        setCategoryManageModal(false);
      }}
    >
      <Spin tip="Loading..." spinning={spinning}>
        <List
          size="small"
          bordered
          dataSource={ledgerCategory}
          renderItem={(categoryItem, index) => (
            <List.Item className="category-list-item font-13">
              {
                operatingStatus.includes('EDITING') && operatingStatus.indexOf(categoryItem.key) > -1 ? ( // 当前项处于编辑状态
                  <>
                    <span className="mr-2">{`${index + 1}.`}</span>
                    <Input
                      size="small"
                      className="font-13"
                      ref={editInputRef}
                      value={newCategoryText}
                      onChange={(e) => setNewCategoryText(e.target.value)}
                      suffix={(
                        <IconFont
                          type="icon-ok"
                          className="btn-ok"
                          onClick={() => fetchInsertUpdateCategory(categoryItem.key)}
                        />
                    )}
                    />
                    <IconFont
                      type="icon-cancel"
                      className="ml-3 mr-1 btn-cancel"
                      onClick={resetOperateStatus} // 取消编辑状态
                    />
                  </>
                ) : ( // 进行列表展示
                  <>
                    <div className="category-id-text">
                      <span className="mr-2">{`${index + 1}. `}</span>
                      {categoryItem.text}
                    </div>
                    <div className="item-operate font-18">
                      {/* 编辑按钮 */}
                      <IconFont
                        type="icon-edit1"
                        className="text-success"
                        onClick={() => { editCategory(categoryItem.key, categoryItem.text); }}
                      />
                      {/* 删除按钮 */}
                      <Popconfirm
                        okText="Yes"
                        cancelText="No"
                        title="Are you sure to delete this task?"
                        onConfirm={() => {
                          fetchDeleteCategory(categoryItem.key, categoryItem.text);
                        }}
                      >
                        <IconFont type="icon-delete1" className="text-danger" />
                      </Popconfirm>
                    </div>
                  </>
                )
              }
            </List.Item>
          )}
        >
          {
            operatingStatus === 'ADDING' && ( // 新增条目
              <List.Item className="category-list-item font-13">
                <span className="mr-2">{`${ledgerCategory.length + 1}.`}</span>
                <Input
                  size="small"
                  className="font-13"
                  ref={addInputRef}
                  value={newCategoryText}
                  onChange={(e) => setNewCategoryText(e.target.value)}
                  suffix={<IconFont type="icon-ok" className="btn-ok" onClick={fetchInsertUpdateCategory} />}
                />
                <IconFont type="icon-cancel" className="ml-3 mr-1 btn-cancel" onClick={resetOperateStatus} />
              </List.Item>
            )
          }
        </List>
      </Spin>
    </Modal>
  );
}
CategoryManage.propTypes = {
  ...ledgerCategoryPropTypes(PropTypes),
  ...ledgerSubtypesPropTypes(PropTypes),
  categoryManageModal: PropTypes.bool.isRequired,
  setCategoryManageModal: PropTypes.func.isRequired,
  handleGetLedgerCategroy: PropTypes.func.isRequired,
};
