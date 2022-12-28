import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhCnTrans from './locale/zh-cn.json'
import enTrans from './locale/en.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTrans, },
      zh: { translation: zhCnTrans, },
    },
    fallbackLng: 'zh-cn', // 选择默认语言
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;