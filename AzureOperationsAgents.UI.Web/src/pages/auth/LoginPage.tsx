import { Helmet } from "react-helmet-async";
// sections
import Login from "../../sections/auth/Login";
import {useLocales} from "../../locales";

// ----------------------------------------------------------------------

export default function LoginPage() {
    
    const { t } = useLocales();
  return (
    <>
      <Helmet>
        <title> Login | {t('product-name')}</title>
      </Helmet>

      <Login />
    </>
  );
}
