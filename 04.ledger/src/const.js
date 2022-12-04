import { createFromIconfontCN } from '@ant-design/icons';

const ICON_FONT = createFromIconfontCN({
  scriptUrl: ['//at.alicdn.com/t/c/font_3663002_oaljkk0mi5.js'],
});

const MENU_ITEMS = [
  { label: '列表', key: 'list' },
  { label: '消费类型管理', key: 'manage' },
];

const ICON_LIST = [
  'icon-fastfood', 'icon-cooking', 'icon-fruits', 'icon-snacks',
  'icon-clothing', 'icon-daily',
  'icon-bus', 'icon-taxi', 'icon-plain',
  'icon-switch', 'icon-badminton',
  'icon-house-rent', 'icon-red-envelope', 'icon-family',
  'icon-unknown'
]

const PAY_WAY_LIST = [
  { key: 'Alipay', label: '支付宝' },
  { key: 'WeChat_pay', label: '微信' },
  { key: 'Credit_Card', label: '信用卡' }
]

const WEEK_STRINGS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export {
  ICON_FONT,
  MENU_ITEMS,
  ICON_LIST,
  PAY_WAY_LIST,
  WEEK_STRINGS
}