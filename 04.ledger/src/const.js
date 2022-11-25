import { createFromIconfontCN } from '@ant-design/icons';

const ICON_FONT = createFromIconfontCN({
  scriptUrl: ['//at.alicdn.com/t/c/font_3663002_irfc4ssz1d.js'],
});

const MENU_ITEMS = [
  { label: '列表', key: 'list' },
  { label: '消费类型管理', key: 'manage' },
];

const ICON_LIST = {
  '饮食': ['icon-fastfood', 'icon-cooking', 'icon-fruits', 'icon-snacks',],
  '消费': ['icon-clothing', 'icon-daily',],
  '交通': ['icon-bus', 'icon-taxi', 'icon-plane',],
  '休闲': ['icon-switch', 'icon-badminton'],
  '家庭支出': ['icon-house-rent', 'icon-red-envelope', 'icon-family'],
  '其它': ['icon-unknown'],
}

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

const ORIGIN_LEDGER_LIST = []

export {
  ICON_FONT,
  MENU_ITEMS,
  ICON_LIST,
  ORIGIN_CATEGORY,
  ORIGIN_SUBTYPES,
  ORIGIN_LEDGER_LIST,
}