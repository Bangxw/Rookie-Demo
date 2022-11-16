const ORIGIN_CATEGORY = [
  { text: '饮食', color: '#cf1322' },
  { text: '消费', color: '#ffec3d' },
  { text: '交通', color: '#52c41a' },
  { text: '休闲', color: '#13c2c2' },
  { text: '家庭支出', color: '#1890ff' },
  { text: '其它', color: '#722ed1' },
]

const ORIGIN_DATA = {
  ledgerCategory: ORIGIN_CATEGORY,
  ledgerSubTypes: [],
  ledgerList: [],
}

export default function countReduce(preState = ORIGIN_DATA, action) {
  const { type, data } = action

  console.log('a2')

  switch (type) {
    case 'UPDATE_LEDGER_CATEGORY': return {...preState, data};
    case 'UPDATE_LEDGER_SUBTYPES': return data;
    case 'UPDATE_LEDGER_LIST': return data;
    default: return preState;
  }
}