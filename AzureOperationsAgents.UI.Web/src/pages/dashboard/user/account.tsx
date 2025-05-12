import { Helmet } from 'react-helmet-async';
// sections
import { AccountView } from 'src/sections/account/view';
import {useLocales} from "../../../locales";

// ----------------------------------------------------------------------

export default function AccountPage() {
    const {t} = useLocales();
  return (
    <>
      <Helmet>
        <title> {t('dashboard')}</title>
      </Helmet>

      <AccountView />
    </>
  );
}
