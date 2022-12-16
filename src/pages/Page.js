import { useTranslation } from "react-i18next";
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

const Page = (props) => {
  const { t } = useTranslation();

  return (
    <ReactMarkdown components={
      {
        a: (props) => <Link to={props.href}>{props.children}</Link>
      }
    }>
      {t(`pages:${props.name}.content`)}
    </ReactMarkdown>
  );
};

export default Page;
