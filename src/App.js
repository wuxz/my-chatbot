import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useTranslation } from 'react-i18next';
import './i18n';  // 引入 i18n 配置
import { BaiduApiKey, BaiduAppId } from './config';
import Chat from './Chat';

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="App">
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('zh')}>中文</button>
      <h1>{t('welcome')}</h1>
      <Chat BaiduApiKey={BaiduApiKey} BaiduAppId={BaiduAppId}/>
    </div>
  );
}

export default App;
