import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 引入翻译文件
import translationEN from './locales/en/translation.json';
import translationZH from './locales/zh/translation.json';

// 配置 i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEN
    },
    zh: {
      translation: translationZH
    },
  },
  lng: 'en', // 默认语言
  fallbackLng: 'en', // 如果当前语言没有对应翻译则回退到默认语言

  interpolation: {
    escapeValue: false, // React 已经对文本做了转义处理
  },
});

export default i18n;
