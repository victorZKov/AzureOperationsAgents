// routes
import { paths } from 'src/routes/paths';

export const VERSION = "0.3-beta";
// API
// ----------------------------------------------------------------------

export const HOST_API = import.meta.env.VITE_HOST_API;
export const HOST_API_OPEN = import.meta.env.VITE_HOST_API_OPEN;
export const WEB_HOST = import.meta.env.VITE_WEB_HOST;
export const HOST_API_KEY = import.meta.env.VITE_HOST_API_KEY;
export const ASSETS_API = import.meta.env.VITE_ASSETS_API;
export const REDIRECT_URI = import.meta.env.VITE_MSAL_REDIRECT_URI;
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
export const AD_API = {
  clientId:
    import.meta.env.VITE_MSAL_CLIENT_ID,
  authority:
    import.meta.env.VITE_MSAL_AUTHORITY,
  scopes:  ['user.read'],    
  redirectUri: REDIRECT_URI
   
};
