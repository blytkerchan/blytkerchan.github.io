import React from "react";
import PostList from "../components/PostList";

export default class Posts extends React.Component {
  constructor({ env }) {
    super();

    this.state = { env, posts: [] };

    fetch(this.state.env.indexEndpoint)
      .then((res) => res.json())
      .then((posts) =>
        this.setState({
          posts,
        })
      );
  }

  componentDidMount() {}

  render() {
    return <PostList posts={this.state.posts} />;
  }
}
