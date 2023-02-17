import React, { useState } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { ledgerCategoryPropTypes, ledgerSubtypesPropTypes } from '@utils/proptypes.config';
import * as actions from '@redux/actions';

import CategoryManage from './category_manage';
import SubtypesManage from './subtypes_manage';

// Category Subtypes CRUD 管理
function CategorySubtypesManage({
  ledgerCategory,
  ledgerSubtypes,
  fetch_ledger_category_data,
  fetch_ledger_subtypes_data,
  showSubtypeManageModal,
  onShowSubtypeManageModal,
  handle_app_spinning,
}) {
  const [categoryManageModal, setCategoryManageModal] = useState(false);

  return (
    <>
      <SubtypesManage
        ledgerCategory={ledgerCategory}
        ledgerSubtypes={ledgerSubtypes}
        fetch_ledger_subtypes_data={fetch_ledger_subtypes_data}
        showSubtypeManageModal={showSubtypeManageModal}
        onShowSubtypeManageModal={onShowSubtypeManageModal}
        handleGetLedgerCategroy={fetch_ledger_category_data}
        categoryManageModal={categoryManageModal}
        setCategoryManageModal={setCategoryManageModal}
        handle_app_spinning={handle_app_spinning}
      />

      <CategoryManage
        ledgerCategory={ledgerCategory}
        ledgerSubtypes={ledgerSubtypes}
        handleGetLedgerCategroy={fetch_ledger_category_data}
        categoryManageModal={categoryManageModal}
        setCategoryManageModal={setCategoryManageModal}
      />
    </>
  );
}
CategorySubtypesManage.propTypes = {
  ...ledgerCategoryPropTypes,
  ...ledgerSubtypesPropTypes,
  showSubtypeManageModal: PropTypes.bool.isRequired,
  onShowSubtypeManageModal: PropTypes.func.isRequired,
  fetch_ledger_category_data: PropTypes.func.isRequired,
  fetch_ledger_subtypes_data: PropTypes.func.isRequired,
  handle_app_spinning: PropTypes.func.isRequired,
};

export default connect((state) => ({
  ledgerCategory: state.ledgerCategory,
  ledgerSubtypes: state.ledgerSubtypes,
}), {
  handle_app_spinning: actions.handle_app_spinning,
  fetch_ledger_category_data: actions.fetch_ledger_category_data,
  fetch_ledger_subtypes_data: actions.fetch_ledger_subtypes_data,
})(CategorySubtypesManage);
