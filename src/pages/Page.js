import { useTranslation } from "react-i18next";

const Page = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t(`pages:${props.name}.title`)}</h2>
      <p>{t(`pages:${props.name}.content`)}</p>
    </>
  );
};

export default Page;
