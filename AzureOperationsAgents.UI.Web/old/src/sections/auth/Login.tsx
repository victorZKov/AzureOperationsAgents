// @mui
import {Stack, Typography, Button, Tooltip, Box} from "@mui/material";
// auth
import { useAuthContext } from "../../auth/useAuthContext";
// layouts
//import LoginLayout from "../../layouts/login";
import {useEffect} from "react";
import {AD_API, VERSION} from "../../config-global";
import CompactLayout from "../../layouts/compact";
import SimpleLayout from "../../layouts/simple";
import AuthModernLayout from "../../layouts/auth/modern";
import {useLocales} from "../../locales";
import {method} from "lodash";
import {useNavigate} from "react-router-dom";

// ----------------------------------------------------------------------


export default function LoginAD() {
    
  const { doLogin, isAuthenticated, user } = useAuthContext();
  const {t} = useLocales();

    const navigate = useNavigate();
    
    const handleLoginAD = async () => {
    try {
        await doLogin();
        const host = window.location.host;
        if (host === 'localhost:8032') {
            const newLocation = `http://${host}/dashboard`;
            window.location.href = newLocation;
        }
        else
        {
            const newLocation = `https://${host}/dashboard`;
            window.location.href = newLocation;
        }
      
    } catch (error) {
      console.error(error);
    }
  };

    const handleRefreshApp = () => {
        const url = new URL(window.location.href);
        // Add cache-busting query parameter to force reload
        url.searchParams.set("cache-bust", Date.now().toString());
        window.location.href = url.toString();
    };

  return (
    <AuthModernLayout>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h4">{t("account.loginmessage")}</Typography>
      </Stack>

      {/*<Button*/}
      {/*  fullWidth*/}
      {/*  color="primary"*/}
      {/*  size="large"*/}
      {/*  variant="contained"*/}
      {/*  onClick={handleLoginAD}*/}
      
      {/*>*/}
      {/*    {t("account.login")}*/}
      {/*</Button>*/}
        
        {/*<Button*/}
        
        {/*    color="inherit"*/}
        {/*    variant="contained"*/}
        {/*    onClick={handleRefreshApp}*/}
        {/*    sx={{*/}
        {/*        mt: 2,*/}
        {/*        bgcolor: "white",*/}
        {/*        color:"grey.800",*/}
        {/*        "&:hover": {*/}
        {/*            bgcolor: "text.primary",*/}
        {/*            color: (theme) =>*/}
        {/*                theme.palette.mode === "light" ? "common.white" : "grey.800",*/}
        {/*        },*/}
        {/*        border: "1px solid",*/}
        
        {/*    }}*/}
        {/*>*/}
        {/*    {t("account.reload")}*/}
        {/*</Button>*/}
        {/*<Typography variant="body2" sx={{ mt: 10, textAlign: "center", fontSize: "8px" }}>*/}
        {/*    BASE: {AD_API.redirectUri}/{isAuthenticated}/{user?.displayName}/{VERSION}*/}
        {/*</Typography>*/}
    </AuthModernLayout>
  );
}
