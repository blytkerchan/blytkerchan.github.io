import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Spinner from "../layout/Spinner";
import useCategories from "../lib/useCategories";
import useTitle from "../lib/useTitle";

import { useTranslation } from "react-i18next";

const Categories = ({ env }) => {
  const { t } = useTranslation();
  const [cats, setCats] = useState([]);

  const [ready, setReady_] = useState(false);
  const setReady = () => setReady_(true);

  const theCategories = useCategories();
  const { setSubtitle } = useTitle();

  useEffect(() => {
    setCats(theCategories.listCategories());
    setReady();
  }, []);

  setSubtitle(t("Categories"));

  if (ready) {
    return (
      <div id="cats">
        <h2 className="category-list-heading">{t("Categories")}</h2>
        <ul className="category-list">
          {cats.map((slug) => (
            <li key={slug}>
              <Link className="category-link" to={`/category/${slug}`}>
                {theCategories.getCategoryName(slug)}&nbsp;({theCategories.getCategoryCount(slug)})
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return <Spinner id="spinner" />;
  }
};

export default Categories;
