import {useTranslation} from "react-i18next";

export const Loading = () => {
  const { t } = useTranslation();
  return <p>{t("authInProgress")}"</p>;
};
