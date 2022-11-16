export const get_ledger_category = () => {
  return dispatch => {
    return fetch('http://127.0.0.1:8800/ledger/category')
      .then(response => response.json())
      .then(response => {
        response.data.map(item => item.key = item._id)
        dispatch({
          type: 'UPDATE_LEDGER_CATEGORY',
          data: response
        })
      }).catch((e) => {
        dispatch({
           type: 'UPDATE_LEDGER_CATEGORY',
        })
      })
  }
}