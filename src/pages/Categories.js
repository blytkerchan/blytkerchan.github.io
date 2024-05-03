import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useCategories from "../lib/useCategories";

import { useTranslation } from "react-i18next";

const Categories = ({ env }) => {
  const { t } = useTranslation();
  const [cats, setCats] = useState([]);

  const theCategories = useCategories();

  useEffect(() => {
    setCats(theCategories.listCategories());
  }, []);

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
};

export default Categories;
