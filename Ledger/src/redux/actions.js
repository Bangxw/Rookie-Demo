import {
  ACTIONS_TYPE_UPDATE_LEDGER_CATEGORY,
  ACTIONS_TYPE_UPDATE_LEDGER_SUBTYPES,
  ACTIONS_TYPE_UPDATE_LEDGER_BILLLIST,
  ACTIONS_TYPE_UPDATE_APP_SPINNING,
  ACTIONS_TYPE_UPDATE_SHOW_DASHBOARD,
  ACTIONS_TYPE_UPDATE_SHOW_SUBTYPE_MANAGE_MODAL,
  ACTIONS_TYPE_UPDATE_SHOW_BILLLIST_ADD_MODAL,
  ACTIONS_TYPE_UPDATE_DATE_PICKER_RANGE,
} from '@src/const';
import { fetch_plus } from '@utils/common';

// 请求category的数据，并且dispatch指令给store
export const fetch_ledger_category_data = () => (dispatch) => fetch_plus('/ledger/category')
  .then((response) => {
    dispatch({
      type: ACTIONS_TYPE_UPDATE_LEDGER_CATEGORY,
      ledgerCategory: response.data,
    });
  })
  .catch(() => {
    dispatch({
      type: ACTIONS_TYPE_UPDATE_LEDGER_CATEGORY,
      ledgerCategory: [],
    });
  });

// 请求subtypes的数据，并且dispatch指令给store
export const fetch_ledger_subtypes_data = () => (dispatch) => fetch_plus('/ledger/subtype')
  .then((response) => {
    dispatch({
      type: ACTIONS_TYPE_UPDATE_LEDGER_SUBTYPES,
      ledgerSubtypes: response.data,
    });
  })
  .catch(() => {
    dispatch({
      type: ACTIONS_TYPE_UPDATE_LEDGER_SUBTYPES,
      ledgerSubtypes: [],
    });
  });

// 请求billlist的数据，并且dispatch指令给store
export const fetch_ledger_billlist_data = () => (dispatch) => fetch_plus('/ledger/billlist')
  .then((response) => {
    dispatch({
      type: ACTIONS_TYPE_UPDATE_LEDGER_BILLLIST,
      ledgerBilllist: response.data,
    });
  })
  .catch(() => {
    dispatch({
      type: ACTIONS_TYPE_UPDATE_LEDGER_BILLLIST,
      ledgerCategory: [],
    });
  });

// 派发更新app_spinning的指令
export const handle_app_spinning = (value) => (dispatch) => {
  dispatch({
    type: ACTIONS_TYPE_UPDATE_APP_SPINNING,
    appSpinning: value,
  });
};

// 派发更新show_dashboard的指令
export const handle_show_dashboard = (value) => (dispatch) => {
  dispatch({
    type: ACTIONS_TYPE_UPDATE_SHOW_DASHBOARD,
    showDashboard: value,
  });
};

// 派发更新show_subtype_manage_modal的指令
export const handle_show_subtype_manage_modal = (value) => (dispatch) => {
  dispatch({
    type: ACTIONS_TYPE_UPDATE_SHOW_SUBTYPE_MANAGE_MODAL,
    showSubtypeManageModal: value,
  });
};

// 派发更新show_billlist_add_modal的指令
export const handle_show_billlist_add_modal = (value) => (dispatch) => {
  dispatch({
    type: ACTIONS_TYPE_UPDATE_SHOW_BILLLIST_ADD_MODAL,
    showBilllistAddModal: value,
  });
};

// 派发更新date_picker_range的指令
export const handle_date_picker_range = (value) => (dispatch) => {
  dispatch({
    type: ACTIONS_TYPE_UPDATE_DATE_PICKER_RANGE,
    datePickerRange: value,
  });
};
