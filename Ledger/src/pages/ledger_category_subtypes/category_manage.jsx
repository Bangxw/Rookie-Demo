import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import {
  Modal, message, Spin, List, Input, Popconfirm,
} from 'antd';
import { fetch_plus } from '@utils/common';
import { ledgerCategoryProptypes } from '@utils/proptypes.config';
import * as actions from '@redux/actions';
import IconFont from '@components/iconfont';

// 主分类的配置
function CategoryManage({
  ledgerCategory,
  categoryManageModal,
  setCategoryManageModal,
  fetch_ledger_category_data,
}) {
  const addInputRef = useRef();
  const editInputRef = useRef();

  const [spinning, setSpinning] = useState(false); // waiting
  const [operatingStatus, setOperatingStatus] = useState('IDLE'); // "ADDING" | "EDITING:ID" | IDLE
  const [categoryText, setCategoryText] = useState('');

  const resetOperateStatus = () => {
    setOperatingStatus('IDLE');
    setCategoryText('');
  };

  // 编辑category需要携带id; 否则就是新增category
  const fetchInsertUpdateCategory = (id) => {
    if (categoryText.trim() === '') {
      message.warning('Category text is required!');
      return;
    }

    const url = operatingStatus.includes('EDITING') ? `/ledger/category/${id}` : '/ledger/category';
    setSpinning(true);
    fetch_plus(url, {
      method: operatingStatus.includes('ADDING') ? 'POST' : 'PUT',
      body: JSON.stringify({
        text: categoryText,
      }),
    }).then((response) => {
      setSpinning(false);
      if (response.status === 1) {
        fetch_ledger_category_data().then(() => {
          resetOperateStatus();
          message.success(response.message, 5);
        });
      } else {
        message.error(response.message);
      }
    });
  };

  // 删除category
  const fetchDeleteCategory = (id) => {
    setSpinning(true);
    fetch_plus(`/ledger/category/${id}`, {
      method: 'DELETE',
    }).then((response) => {
      setSpinning(false);
      if (response.status === 1) {
        fetch_ledger_category_data().then(() => {
          message.success(response.message, 5);
        });
      } else {
        message.error(response.message);
      }
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
    setCategoryText(text);
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
          bordered
          size="small"
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
                      value={categoryText}
                      onChange={(e) => setCategoryText(e.target.value)}
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
                          fetchDeleteCategory(categoryItem.key);
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
                  value={categoryText}
                  onChange={(e) => setCategoryText(e.target.value)}
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
  ...ledgerCategoryProptypes,
  categoryManageModal: PropTypes.bool.isRequired,
  setCategoryManageModal: PropTypes.func.isRequired,
  fetch_ledger_category_data: PropTypes.func.isRequired,
};
export default connect(
  (state) => ({ ledgerCategory: state.ledgerCategory }),
  { fetch_ledger_category_data: actions.fetch_ledger_category_data },
)(CategoryManage);
