import {
  FETCH_URL,
  ACTIONS_TYPE_UPDATE_LEDGER_CATEGORY,
  ACTIONS_TYPE_UPDATE_LEDGER_SUBTYPES,
  ACTIONS_TYPE_UPDATE_LEDGER_BILLLIST,
  ACTIONS_TYPE_UPDATE_APP_SPINNING,
} from '@src/const';
import { fetch_plus } from '@utils/common';

// 请求category的数据，并且dispatch指令给store
export const fetch_ledger_category_data = () => (dispatch) => fetch_plus(`${FETCH_URL}/ledger/category`)
  .then((response) => response.json())
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
export const fetch_ledger_subtypes_data = () => (dispatch) => fetch_plus(`${FETCH_URL}/ledger/subtypes`)
  .then((response) => response.json())
  .then((response) => {
    dispatch({
      type: ACTIONS_TYPE_UPDATE_LEDGER_SUBTYPES,
      ledgerCategory: response.data,
    });
  })
  .catch(() => {
    dispatch({
      type: ACTIONS_TYPE_UPDATE_LEDGER_SUBTYPES,
      ledgerCategory: [],
    });
  });

// 请求billlist的数据，并且dispatch指令给store
export const fetch_ledger_billlist_data = () => (dispatch) => fetch_plus(`${FETCH_URL}/ledger/billlist`)
  .then((response) => response.json())
  .then((response) => {
    dispatch({
      type: ACTIONS_TYPE_UPDATE_LEDGER_BILLLIST,
      ledgerCategory: response.data,
    });
  })
  .catch(() => {
    dispatch({
      type: ACTIONS_TYPE_UPDATE_LEDGER_BILLLIST,
      ledgerCategory: [],
    });
  });

// 请求billlist的数据，并且dispatch指令给store
export const handle_app_spinning = (value) => (dispatch) => {
  dispatch({
    type: ACTIONS_TYPE_UPDATE_APP_SPINNING,
    appSpinning: value,
  });
};
