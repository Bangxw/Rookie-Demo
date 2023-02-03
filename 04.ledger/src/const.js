import { createFromIconfontCN } from '@ant-design/icons';

const ICON_FONT = createFromIconfontCN({
  scriptUrl: ['//at.alicdn.com/t/c/font_3663002_dt44meukv34.js'],
});

const ICON_LIST = [
  'icon-fastfood', 'icon-cooking', 'icon-fruits', 'icon-snacks', 'icon-feast',
  'icon-clothing', 'icon-daily',
  'icon-bus', 'icon-taxi', 'icon-plain', 'icon-fuel-up', 'icon-parking',
  'icon-switch', 'icon-call-plan', 'icon-badminton',
  'icon-house-rent', 'icon-red-envelope', 'icon-family', 'icon-baby', 'icon-gift',
  'icon-unknown',
];

const PAY_WAY_LIST = [
  { key: 'Alipay', label: '支付宝' },
  { key: 'WeChat_pay', label: '微信' },
  { key: 'Credit_Card', label: '信用卡' },
];

// const REMOTE_ADDRESS = 'http://43.139.239.207:8800'
const REMOTE_ADDRESS = 'http://127.0.0.1:8800';

export {
  ICON_FONT,
  ICON_LIST,
  PAY_WAY_LIST,
  REMOTE_ADDRESS,
};
