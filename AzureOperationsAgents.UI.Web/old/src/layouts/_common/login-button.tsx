// @mui
import { Theme, SxProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
// routes
import { RouterLink } from 'src/routes/components';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
import {useLocales} from "../../locales";
import {useAuthContext} from "../../auth/useAuthContext";

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
};

export default function LoginButton({ sx }: Props) {
  const { t } = useLocales();
  const {user, doLogin} = useAuthContext();

  const handleLogin = async () => {
    try {
      if (user === null) {
        await doLogin();
      }
      if (user) {
        const host = window.location.host;
        if (host === 'localhost:8032') {
          window.location.href = `http://${host}/dashboard`;
        }
        else
        {
          window.location.href = `https://${host}/dashboard`;
        }

      } else {
        console.log('User is still null after login attempt');
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <Button component={RouterLink}
            onClick={handleLogin}
            variant="outlined" sx={{ mr: 1, ...sx }}>
      {t("auth.login")}
    </Button>
  );
}
