// src/auth/AuthContext.tsx
        import {
          createContext,
          useEffect,
          useReducer,
          useCallback,
          useMemo,
          useState,
        } from "react";
        import {
          Configuration,
          InteractionRequiredAuthError,
          PopupRequest,
        } from "@azure/msal-browser";
        import { useAccount, useIsAuthenticated, useMsal } from "@azure/msal-react";
        import { AD_API, HOST_API, HOST_API_KEY } from "../config-global";
        import {
          ActionMapType,
          AuthStateType,
          AuthUserType,
          AuthB2cContextType,
        } from "./types";
        import { useLocales } from "src/locales";
        import { api } from "../utils/axios";
        import i18n from "i18next";
        
        // ----------------------------------------------------------------------
        
        enum Types {
          INITIAL = "INITIAL",
          LOGIN = "LOGIN",
          LOGOUT = "LOGOUT",
        }
        
        type Payload = {
          [Types.INITIAL]: {
            isAuthenticated: boolean;
            idToken: string;
            user: AuthUserType;
            accessToken: string;
          };
          [Types.LOGIN]: {
            user: AuthUserType;
            idToken: string;
          };
          [Types.LOGOUT]: undefined;
        };
        
        type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];
        
        const initialState: AuthStateType = {
          isInitialized: false,
          isAuthenticated: false,
          user: null,
          idToken: "",
        };
        
        const reducer = (state: AuthStateType, action: ActionsType) => {
          if (action.type === Types.INITIAL) {
            return {
              isInitialized: true,
              isAuthenticated: action.payload.isAuthenticated,
              user: action.payload.user,
              idToken: action.payload.idToken,
            };
          }
          if (action.type === Types.LOGIN) {
            return {
              ...state,
              idToken: action.payload.idToken,
              isAuthenticated: true,
              user: action.payload.user,
            };
          }
          if (action.type === Types.LOGOUT) {
            return {
              ...state,
              isAuthenticated: false,
              user: null,
              idToken: "",
            };
          }
          return state;
        };
        
        export const AuthContext = createContext<AuthB2cContextType | null>(null);
        
        export const msalConfig: Configuration = {
          auth: {
            clientId: AD_API.clientId,
            authority: AD_API.authority,
            redirectUri: `${AD_API.redirectUri}dashboard`,
            knownAuthorities: ["coloreame.b2clogin.com"],
            postLogoutRedirectUri: "/",
          },
          system: {
            allowNativeBroker: false, // Disables WAM Broker
          },
        };
        
        export const graphConfig = {
          graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
        };
        
        type AuthProviderProps = {
          children: React.ReactNode;
        };
        
        export function AuthProvider({ children }: AuthProviderProps) {
          const { instance, accounts } = useMsal();
          const [state, dispatch] = useReducer(reducer, initialState);
          const isAuthenticated = useIsAuthenticated();
          const { currentLang } = useLocales();
          const [isLoginInProgress, setIsLoginInProgress] = useState(false);
        
          // Get current language - centralized function
          const getCurrentLanguage = useCallback(() => {
            return i18n.language || localStorage.getItem("i18nextLng") || currentLang.value;
          }, [currentLang.value]);
        
          // Configure API interceptors when authentication state changes
          useEffect(() => {
            if (isAuthenticated) {
              // Response interceptor
              const responseInterceptor = api.interceptors.response.use(
                (response) => response,
                (error) => Promise.reject((error.response && error.response.data) || "Something went wrong")
              );
        
              // Request interceptor
              const requestInterceptor = api.interceptors.request.use(
                async (config) => {
                  if (!accounts[0]) {
                    throw new Error("No active account! Verify a user has been signed in.");
                  }
        
                  try {
                    // Try silent token acquisition
                    const response = await instance.acquireTokenSilent({
                      scopes: AD_API.scopes,
                      account: accounts[0],
                    });
        
                    const currentLanguage = getCurrentLanguage();
                    
                    // Set headers
                    config.headers.Authorization = `Bearer ${response.accessToken}`;
                    config.headers.idToken = response.idToken;
                    config.headers["Ocp-Apim-Subscription-Key"] = HOST_API_KEY;
                    
                    // Set params
                    config.params = {
                      ...config.params,
                      code: HOST_API_KEY,
                      language: currentLanguage,
                    };
                    
                  } catch (error) {
                    if (error instanceof InteractionRequiredAuthError) {
                      console.warn("Silent token acquisition failed, falling back to popup.");
                      try {
                        // Use popup as fallback
                        const popupResponse = await instance.acquireTokenPopup({
                          scopes: AD_API.scopes,
                        });
                        
                        config.headers.Authorization = `Bearer ${popupResponse.accessToken}`;
                        config.headers.idToken = popupResponse.idToken;
                        
                      } catch (popupError) {
                        console.error("Popup token acquisition failed:", popupError);
                        throw popupError;
                      }
                    } else {
                      console.error("Error in token acquisition:", error);
                      throw error;
                    }
                  }
        
                  return config;
                }
              );
        
              // Clean up interceptors
              return () => {
                api.interceptors.response.eject(responseInterceptor);
                api.interceptors.request.eject(requestInterceptor);
              };
            }
          }, [isAuthenticated, accounts, instance, getCurrentLanguage]);
        
          // Initialize the auth context with user data
          const initialize = useCallback(async () => {
            try {
              if (isAuthenticated && accounts[0]) {
                const account = accounts[0];
                
                try {
                  const result = await instance.acquireTokenSilent({
                    scopes: AD_API.scopes,
                    account,
                  });
        
                  if (result) {
                    dispatch({
                      type: Types.INITIAL,
                      payload: {
                        isAuthenticated: true,
                        idToken: result.idToken,
                        accessToken: result.accessToken,
                        user: {
                          ...account,
                          displayName: account?.name,
                          role: "user",
                        },
                      },
                    });
                  }
                } catch (error) {
                  console.error("Error acquiring token silently:", error);
                  dispatch({
                    type: Types.INITIAL,
                    payload: {
                      idToken: "",
                      isAuthenticated: false,
                      user: null,
                      accessToken: "",
                    },
                  });
                }
              } else {
                dispatch({
                  type: Types.INITIAL,
                  payload: {
                    idToken: "",
                    isAuthenticated: false,
                    user: null,
                    accessToken: "",
                  },
                });
              }
            } catch (error) {
              console.error("Error initializing auth context:", error);
              dispatch({
                type: Types.INITIAL,
                payload: {
                  idToken: "",
                  isAuthenticated: false,
                  user: null,
                  accessToken: "",
                },
              });
            }
          }, [accounts, instance, isAuthenticated]);
        
          useEffect(() => {
            initialize();
          }, [initialize]);
        
          // Login function
          const doLogin = useCallback(async () => {
            if (isLoginInProgress) return;
            setIsLoginInProgress(true);
          
            try {
              // First check if there's an active account
              if (instance.getActiveAccount()) {
                // User is already logged in
                return;
              }
          
              const currentLanguage = getCurrentLanguage();
              
              // Handle any pending redirect operations first
              await instance.handleRedirectPromise().catch(e => {
                console.log('Handling redirect promise:', e);
              });
          
              // Create login request
              const loginRequest: PopupRequest = {
                scopes: AD_API.scopes,
                redirectUri: `${AD_API.redirectUri}`,
                extraQueryParameters: { ui_locales: currentLanguage },
              };
          
              // Start login redirect
              if (accounts.length === 0) {
                await instance.loginRedirect(loginRequest);
              }
            } catch (error) {
              // Check if this is an interaction_in_progress error
              if (error.errorCode === 'interaction_in_progress') {
                console.log('Another login flow is in progress. Please complete that first.');
              } else {
                console.error("Login error:", error);
              }
            } finally {
              setIsLoginInProgress(false);
            }
          }, [instance, isLoginInProgress, getCurrentLanguage]);
        
          // Logout function
          const logout = useCallback(async () => {
            try {
              const logoutUrl = `https://coloreame.b2clogin.com/coloreame.onmicrosoft.com/B2C_1_SI/oauth2/v2.0/logout?post_logout_redirect_uri=${AD_API.redirectUri}`;
        
              const logoutRequest = {
                postLogoutRedirectUri: logoutUrl,
              };
        
              // Perform logout
              await instance.logoutRedirect(logoutRequest);
              
              // Dispatch logout action
              dispatch({ type: Types.LOGOUT });
            } catch (error) {
              console.error("Logout error:", error);
            }
          }, [instance]);
        
          // Create memoized context value to prevent unnecessary re-renders
          const contextValue = useMemo(
            () => ({
              isInitialized: state.isInitialized,
              isAuthenticated: state.isAuthenticated,
              user: state.user,
              method: "post",
              doLogin,
              logout,
            }),
            [state.isAuthenticated, state.isInitialized, state.user, doLogin, logout]
          );
        
          return (
            <AuthContext.Provider value={contextValue}>
              {children}
            </AuthContext.Provider>
          );
        }