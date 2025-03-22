import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import translationEN from "../app/locales/en-US/translation.json";
import translationBR from "../app/locales/pt-BR/translation.json";

const resources = {
  'en-US': {
    translation: translationEN
  },
  'pt-BR': {
    translation: translationBR
  }
};

i18n
  .use(Backend) // Carrega os arquivos de tradução via HTTP, ajustando a URL conforme necessário
  .use(LanguageDetector) // Detecta o idioma do navegador
  .use(initReactI18next) // Integra o i18next com o React
  .init({
    //fallbackLng: 'en-US', // Idioma de fallback caso o idioma detectado não esteja disponível
    //supportedLngs: ['pt-BR', 'en' ,'en-US'], // Idiomas suportados
    //debug: true, // Habilite a depuração para verificar se os arquivos de tradução estão sendo carregados corretamente
    interpolation: {
      escapeValue: false, // Importante para evitar problemas com escape de HTML (já que o React faz isso)
    },
    resources,
    lng: "en-US"
  });

  i18n.on('languageChanged', (lng) => {
    console.log('Idioma detectado:', lng);
    console.log('Linguagens suportadas:', i18n.options.supportedLngs);
    console.log('Códigos de idioma disponíveis:', i18n.languages);
  });
  
export default i18n;
