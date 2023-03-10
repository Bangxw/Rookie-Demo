import { map_list_insert_key } from '@utils/common';
import {
  ACTIONS_TYPE_UPDATE_LEDGER_CATEGORY,
  ACTIONS_TYPE_UPDATE_LEDGER_SUBTYPES,
  ACTIONS_TYPE_UPDATE_LEDGER_BILLLIST,
  ACTIONS_TYPE_UPDATE_APP_SPINNING,
} from '@src/const';

// 默认数据结构
const originData = {
  ledgerCategory: [],
  ledgerSubtypes: [],
  ledgerBilllist: [],
  appSpinning: false,
};

// 更新store的reducer
export default function reducer(preState = originData, {
  type, ledgerCategory, ledgerSubtypes, ledgerBilllist, appSpinning,
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

    default: return preState;
  }
}