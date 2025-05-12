import { Helmet } from 'react-helmet-async';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// sections
import { OverviewAppView } from 'src/sections/overview/app/view';
import { useLocales } from 'src/locales';
import { useGetUser } from 'src/api/user';
import BlankView from "../../sections/blank/view";

// ----------------------------------------------------------------------

export default function OverviewAppPage() {

  const { t } = useLocales();

  const { profile } = useGetUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
    const subscriptionType = Cookies.get('subscriptionType');
    const redirectToPayment = Cookies.get('redirectToPayment');
    if (redirectToPayment === 'true' && subscriptionType && subscriptionType !== 'free') {
      //Cookies.remove('redirectToPayment');
      navigate('/checkout', { state: { subscriptionType, user: profile } });
    }
    }
  }, [profile, navigate]);

  return (
    <>
      <Helmet>
        <title> {t('dashboad')}</title>
      </Helmet>
  <BlankView />
      {/*<OverviewAppView />*/}
    </>
  );
}
