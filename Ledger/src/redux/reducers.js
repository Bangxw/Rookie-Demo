import { map_list_insert_key } from '@utils/common';
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

// 默认数据结构
const originData = {
  ledgerCategory: [],
  ledgerSubtypes: [],
  ledgerBilllist: [],
  appSpinning: false,
  showDashboard: false,
  showSubtypeManageModal: false,
  showBilllistAddModal: false,
  datePickerRange: -1,
};

// 更新store的reducer
export default function reducer(preState = originData, {
  type,
  ledgerCategory, ledgerSubtypes, ledgerBilllist,
  appSpinning,
  showDashboard, showSubtypeManageModal, showBilllistAddModal,
  datePickerRange,
} = []) {
  switch (type) {
    case ACTIONS_TYPE_UPDATE_LEDGER_CATEGORY:
      return {
        ...preState,
        ledgerCategory: map_list_insert_key(ledgerCategory),
      };

    case ACTIONS_TYPE_UPDATE_LEDGER_SUBTYPES:
      return {
        ...preState,
        ledgerSubtypes: map_list_insert_key(ledgerSubtypes),
      };

    case ACTIONS_TYPE_UPDATE_LEDGER_BILLLIST:
      return {
        ...preState,
        ledgerBilllist: map_list_insert_key(ledgerBilllist),
      };

    case ACTIONS_TYPE_UPDATE_APP_SPINNING:
      return { ...preState, appSpinning };

    case ACTIONS_TYPE_UPDATE_SHOW_DASHBOARD:
      return { ...preState, showDashboard };

    case ACTIONS_TYPE_UPDATE_SHOW_SUBTYPE_MANAGE_MODAL:
      console.log(showSubtypeManageModal);
      return { ...preState, showSubtypeManageModal };

    case ACTIONS_TYPE_UPDATE_SHOW_BILLLIST_ADD_MODAL:
      return { ...preState, showBilllistAddModal };

    case ACTIONS_TYPE_UPDATE_DATE_PICKER_RANGE:
      return { ...preState, datePickerRange };

    default: return preState;
  }
}
