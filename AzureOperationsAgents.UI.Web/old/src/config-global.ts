export const VERSION = "0.1";
// API
// ----------------------------------------------------------------------

export const HOST_API = import.meta.env.VITE_HOST_API;
export const HOST_API_OPEN = import.meta.env.VITE_HOST_API_OPEN;
export const WEB_HOST = import.meta.env.VITE_WEB_HOST;
export const HOST_API_KEY = import.meta.env.VITE_HOST_API_KEY;
export const AD_API = {
  clientId:
    import.meta.env.VITE_MSAL_CLIENT_ID,
  authority:
    import.meta.env.VITE_MSAL_AUTHORITY,
  scopes:  ["api://azure-agents-api"],    
  redirectUri: import.meta.env.VITE_MSAL_REDIRECT_URI
   
};
