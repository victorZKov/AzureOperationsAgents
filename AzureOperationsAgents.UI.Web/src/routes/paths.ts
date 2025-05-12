// utils
import { paramCase } from 'src/utils/change-case';
import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  success: '/checkout/success',
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  termsConditions: '/terms-conditions',
  removeMyData: '/remove-my-data',
  privacyPolicy: '/privacy-policy',
  changelog: '/change-log',
  // AUTH
  auth: {
    b2c: {
      login: `${ROOTS.AUTH}/loginPage`,
      register: `${ROOTS.AUTH}/register`,
    }
  },
  // DASHBOARD
  dashboard: {
    root: `${ROOTS.DASHBOARD}/`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    generation: `${ROOTS.DASHBOARD}/generation`,
    agents: `${ROOTS.DASHBOARD}/agents`,
    audit: `${ROOTS.DASHBOARD}/audit`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
    },
     user: {
       // profile: `${ROOTS.DASHBOARD}/user/profile`,
       account: `${ROOTS.DASHBOARD}/user/account`,
       edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
       list: `${ROOTS.DASHBOARD}/user/list`,
     },
  },
  product: {
    root: `/pricing`,
    checkout: `/product/checkout`,
    
  },
};
