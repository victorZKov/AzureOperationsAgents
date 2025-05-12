import merge from 'lodash/merge';
import {
  enUS as enUSAdapter,
  fr as frFRAdapter,
  es as esESAdapter,
    sk as skSKAdapter,
    pt as ptPTAdapter,
    
} from 'date-fns/locale';
// core
import {
  enUS as enUSCore,
  frFR as frFRCore,
  esES as esESCore,
    skSK as skSKCore,
    ptPT as ptPTCore,
    caES as caESCore,
} from '@mui/material/locale';
// date-pickers
import {
  enUS as enUSDate,
  frFR as frFRDate,
  esES as esESDate,
    skSK as skSKDate,
    eu as ptPTDate,
} from '@mui/x-date-pickers/locales';
// data-grid
import {
  enUS as enUSDataGrid,
  frFR as frFRDataGrid,
  esES as esESDataGrid,
    skSK as skSKDataGrid,
    ptPT as ptPTDataGrid,
    
    
    
} from '@mui/x-data-grid';

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: 'Español',
    value: 'es',
    systemValue: merge(esESDate, esESDataGrid, esESCore),
    adapterLocale: esESAdapter,
    icon: 'flagpack:es',
  },
  {
    label: 'English',
    value: 'en',
    systemValue: merge(enUSDate, enUSDataGrid, enUSCore),
    adapterLocale: enUSAdapter,
    icon: 'flagpack:gb-nir',
  },
  // {
  //   label: 'Français',
  //   value: 'fr',
  //   systemValue: merge(frFRDate, frFRDataGrid, frFRCore),
  //   adapterLocale: frFRAdapter,
  //   icon: 'flagpack:fr',
  // },
  // {
  //   label: 'Slovenčina',
  //   value: 'sk',
  //   systemValue: merge(skSKDataGrid, esESCore),
  //   adapterLocale: skSKAdapter,
  //   icon: 'flagpack:sk',
  // },
  // {
  //   label: 'Português',
  //   value: 'pt',
  //   systemValue: merge(ptPTDate, ptPTDataGrid, ptPTCore),
  //   adapterLocale: ptPTAdapter,
  //   icon: 'flagpack:pt',
  // },
  // {
  //   label: 'Euskera',
  //   value: 'eus',
  //   systemValue: merge(esESDate, esESDataGrid, esESCore),
  //   adapterLocale: esESAdapter,
  //   icon: '/assets/images/flags/euskadi.jpg',
  // },
  // {
  //   label: 'Català',
  //   value: 'ca',
  //   systemValue: merge(caESCore),
  //   adapterLocale: esESAdapter,
  //   icon: '/assets/images/flags/catalunya.jpg',
  // },
  // {
  //   label: 'Galego',
  //   value: 'gl',
  //   systemValue: merge(esESDate, esESDataGrid, esESCore),
  //   adapterLocale: esESAdapter,
  //   icon: '/assets/images/flags/galicia.png',
  // }
];

export const defaultLang = allLangs[0]; // Español

// GET MORE COUNTRY FLAGS
// https://icon-sets.iconify.design/flagpack/
// https://www.dropbox.com/sh/nec1vwswr9lqbh9/AAB9ufC8iccxvtWi3rzZvndLa?dl=0
