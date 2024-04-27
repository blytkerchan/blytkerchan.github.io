const { t } = require("i18next");

const PostList = (props) => {
  return (
    <>
      <h2 className="post-list-heading">{t("Posts")}</h2>
      <ul className="post-list">
        {props.posts.map(({ title, permalink, locallink, excerpt, date }) => (
          <li key={permalink}>
            <span className="post-meta">{new Date(Date.parse(date)).toLocaleDateString()}</span>
            <h3>
              <a className="post-link" href={locallink}>
                {title}
              </a>
            </h3>
            {excerpt}
          </li>
        ))}
      </ul>
    </>
  );
};

export default PostList;
