import { REMOTE_ADDRESS } from '@/const'

export const get_ledger_category = () => {
  return dispatch => {
    return fetch(REMOTE_ADDRESS+ '/ledger/category')
      .then(response => response.json())
      .then(response => {
        dispatch({
          type: 'UPDATE_LEDGER_CATEGORY',
          ledgerCategory: response.data
        })
      }).catch((e) => {
        dispatch({
          type: 'UPDATE_LEDGER_CATEGORY',
          ledgerCategory: []
        })
      })
  }
}

export const get_ledger_subtypes = () => {
  return dispatch => {
    return fetch(REMOTE_ADDRESS+ '/ledger/sub_types')
      .then(response => response.json())
      .then(response => {
        dispatch({
          type: 'UPDATE_LEDGER_SUBTYPES',
          ledgerSubTypes: response.data
        })
      }).catch((e) => {
        dispatch({
          type: 'UPDATE_LEDGER_SUBTYPES',
          ledgerSubTypes: []
        })
      })
  }
}

export const get_ledger_list = () => {
  return dispatch => {
    return fetch(REMOTE_ADDRESS+ '/ledger/bill_list')
      .then(response => response.json())
      .then(response => {
        dispatch({
          type: 'UPDATE_LEDGER_LIST',
          ledgerList: response.data
        })
      }).catch((e) => {
        dispatch({
          type: 'UPDATE_LEDGER_LIST',
          ledgerList: []
        })
      })
  }
}

export const set_app_spinning = value => {
  return dispatch => {
    dispatch({
      type: 'UPDATE_APP_SPINNING',
      appSpinning: value
    })
  }
}