import { map_list_insert_key } from '@utils/common';

const ORIGIN_DATA = {
  ledgerCategory: [],
  ledgerSubTypes: [],
  ledgerList: [],
  appSpinning: false,
};

// eslint-disable-next-line default-param-last
export default function countReduce(preState = ORIGIN_DATA, action) {
  const {
    type, ledgerCategory, ledgerSubTypes, ledgerList, appSpinning,
  } = action;
  switch (type) {
    case 'UPDATE_LEDGER_CATEGORY': return { ...preState, ledgerCategory: map_list_insert_key(ledgerCategory) };
    case 'UPDATE_LEDGER_SUBTYPES': return { ...preState, ledgerSubTypes: map_list_insert_key(ledgerSubTypes) };
    case 'UPDATE_LEDGER_LIST': return { ...preState, ledgerList: map_list_insert_key(ledgerList) };
    case 'UPDATE_APP_SPINNING': return { ...preState, appSpinning };
    default: return preState;
  }
}
