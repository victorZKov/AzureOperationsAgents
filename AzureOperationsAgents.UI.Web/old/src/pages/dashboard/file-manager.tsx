import { Helmet } from 'react-helmet-async';
// sections
import { FileManagerView } from 'src/sections/file-manager/view';
import {useLocales} from "../../locales";

// ----------------------------------------------------------------------

export default function FileManagerPage() {
  const { t } = useLocales();
  return (
    <>
      <Helmet>
        <title> {t("dashboard")}: {t("fileManager.title")}</title>
      </Helmet>

      <FileManagerView />
    </>
  );
}
