import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
// utils
import { localStorageGetItem } from 'src/utils/storage-available';
//
import { defaultLang } from './config-lang';
//
import translationEn from './langs/en.json';
import translationFr from './langs/fr.json';
import translationEs from './langs/es.json';
import translationPt from './langs/pt.json';
import translationSk from './langs/sk.json';
import translationEus from './langs/eus.json';
import translationCa from './langs/ca.json';
import translationGl from './langs/gi.json';


// ----------------------------------------------------------------------

const lng = localStorageGetItem('i18nextLng', defaultLang.value);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translations: translationEn },
      fr: { translations: translationFr },
      es: { translations: translationEs },
        pt: { translations: translationPt },
        sk: { translations: translationSk },
        eus: { translations: translationEus },
        ca: { translations: translationCa },
        gl: { translations: translationGl }
    },
    lng,
    fallbackLng: lng,
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
