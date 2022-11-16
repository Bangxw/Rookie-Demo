const ICONFONT_URL = '//at.alicdn.com/t/c/font_3663002_ik18pfm7fjl.js'

const ORIGIN_CATEGORY = [
  { text: '饮食', color: '#cf1322' },
  { text: '消费', color: '#ffec3d' },
  { text: '交通', color: '#52c41a' },
  { text: '休闲', color: '#13c2c2' },
  { text: '家庭支出', color: '#1890ff' },
  { text: '其它', color: '#722ed1' },
]
const ORIGIN_SUBTYPES = [
  { icon: 'icon-fastfood', text: '早餐', category: '饮食' },
  { icon: 'icon-fruits', text: '水果', category: '饮食' }
]
const ORIGIN_LEDGER_LIST = [
  { date: '', amount: '早餐', subtype: '饮食', subtype: '饮食', payway: '' },
  { icon: 'icon-fruits', text: '水果', category: '饮食' }
]

export {
  ICONFONT_URL, ORIGIN_CATEGORY, ORIGIN_SUBTYPES, ORIGIN_LEDGER_LIST
}