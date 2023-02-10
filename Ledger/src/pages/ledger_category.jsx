import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Modal, Tabs } from 'antd';
import * as actions from '@redux/actions';

function CategoryConfig({

}) {
  return <>1111</>;
}

function SubtypesManage({
  ledgerCategory,
  ledgerSubTypes,
  showSubtypeManageModal,
  onShowSubtypeManageModal,
  get_ledger_category: get_ledger_category_data,
  get_ledger_subtypes: get_ledger_subtypes_data,
  handle_app_spinning: handle_app_spingning_status, // 控制spinning展示
}) {
  return (
    <Modal>
      <Tabs
        tabPosition="left"
        className="category-ant-tabs"
        activeKey={activeTabKey}
      />
    </Modal>
  );
}
SubtypesManage.propTypes = {
  ledgerCategory: PropTypes.arrayof().isRequired,
  ledgerSubTypes: PropTypes.arrayof().isRequired,
  showSubtypeManageModal: PropTypes.bool.isRequired,
  onShowSubtypeManageModal: PropTypes.func.isRequired,
  get_ledger_category: PropTypes.func().isRequired,
  get_ledger_subtypes: PropTypes.func().isRequired,
  handle_app_spinning: PropTypes.func().isRequired,
};

export default connect(
  () => {},
  {
    get_ledger_category: actions.get_ledger_category,
    get_ledger_subtypes: actions.get_ledger_subtypes,
    handle_app_spinning: actions.handle_app_spinning,
  },
)(SubtypesManage);
