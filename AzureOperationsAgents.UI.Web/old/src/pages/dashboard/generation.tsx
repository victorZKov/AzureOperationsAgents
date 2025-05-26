import { Helmet } from 'react-helmet-async';
// sections
import { GenerationView } from 'src/sections/generation/view';
import {useLocales} from "../../locales";

// ----------------------------------------------------------------------

export default function GenerationPage() {
  const { t } = useLocales();
  return (
    <>
      <Helmet>
        <title> {t("dashboard")}: {t("generation.title")}</title>
      </Helmet>

      <GenerationView/>

    </>
  );
}
