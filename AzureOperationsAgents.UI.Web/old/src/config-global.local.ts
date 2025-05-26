// routes
import { paths } from 'src/routes/paths';

export const VERSION = "0.0.1";
// API
// ----------------------------------------------------------------------

export const HOST_API = import.meta.env.VITE_HOST_API;

export const WEB_HOST = import.meta.env.VITE_WEB_HOST;

export const HOST_API_KEY = import.meta.env.VITE_HOST_API_KEY;

export const ASSETS_API = import.meta.env.VITE_ASSETS_API;

export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'

export const AD_API = {
  clientId:
    "d087f6ce-9fb2-4972-8a71-b4a90bdce5f6",
  authority:
    "https://coloreame.b2clogin.com/coloreame.onmicrosoft.com/B2C_1_SUSI",
  scopes:  ["https://coloreame.onmicrosoft.com/app/App.Access",
            "https://coloreame.onmicrosoft.com/app/todo"],    
  redirectUri: WEB_HOST
   
};
