import { Helmet } from 'react-helmet-async';
// sections
import {PrivacyPolicyView} from "../sections/privacy-policy/view";
import {useLocales} from "../locales";

// ----------------------------------------------------------------------

export default function PrivacyPolicyPage() {
  const {t} = useLocales();
  return (
    <>
      <Helmet>
        <title>{t("privacyPolicy")}</title>
      </Helmet>

      <PrivacyPolicyView />
    </>
  );
}
