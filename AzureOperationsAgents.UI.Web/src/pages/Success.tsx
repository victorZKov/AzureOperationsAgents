import { Helmet } from 'react-helmet-async';
// sections
import Success from "../sections/account/success";

import {useLocales} from "../locales";


// ----------------------------------------------------------------------

export default function SuccessPage() {
    
    const { t } = useLocales();
    
    const isProfile = window.location.href.includes('profile=true');
  return (
    <>
      <Helmet>
        <title> {t('success')}</title>
      </Helmet>

      <Success isProfile={isProfile} />
    </>
  );
}
