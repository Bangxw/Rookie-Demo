import { REMOTE_ADDRESS } from '@/const';

export const get_ledger_category = () => (dispatch) => fetch(`${REMOTE_ADDRESS}/ledger/category`)
  .then((response) => response.json())
  .then((response) => {
    dispatch({
      type: 'UPDATE_LEDGER_CATEGORY',
      ledgerCategory: response.data,
    });
  }).catch(() => {
    dispatch({
      type: 'UPDATE_LEDGER_CATEGORY',
      ledgerCategory: [],
    });
  });

export const get_ledger_subtypes = () => (dispatch) => fetch(`${REMOTE_ADDRESS}/ledger/sub_types`)
  .then((response) => response.json())
  .then((response) => {
    dispatch({
      type: 'UPDATE_LEDGER_SUBTYPES',
      ledgerSubTypes: response.data,
    });
  }).catch(() => {
    dispatch({
      type: 'UPDATE_LEDGER_SUBTYPES',
      ledgerSubTypes: [],
    });
  });

export const get_ledger_list = () => (dispatch) => fetch(`${REMOTE_ADDRESS}/ledger/bill_list`)
  .then((response) => response.json())
  .then((response) => {
    dispatch({
      type: 'UPDATE_LEDGER_LIST',
      ledgerList: response.data,
    });
  }).catch(() => {
    dispatch({
      type: 'UPDATE_LEDGER_LIST',
      ledgerList: [],
    });
  });

export const handle_app_spinning = (value) => (dispatch) => {
  dispatch({
    type: 'UPDATE_APP_SPINNING',
    appSpinning: value,
  });
};
