import React from 'react';
import { Page, Navbar, List, ListItem } from 'framework7-react';

const API =
  'https://public-api.wordpress.com/wp/v2/sites/monacasampleapp.wordpress.com/';
const ALL_POSTS = 'posts?';
const PER_PAGE = 'per_page=';
const PAGE = 'page=';

export default class extends React.Component {
  constructor() {
    super();

    this.state = {
      posts: [],
    };
  }

  render() {
    const { posts } = this.state;

    return (
      <Page name="posts">
        <Navbar title="WP App" />
        <List>
          {posts.map((post) => (
            <ListItem
              key={post.id}
              title={post.title.rendered}
              link={`/post/${post.id}/`}
            />
          ))}
        </List>
      </Page>
    );
  }

  componentDidMount() {
    // Fetch data
    fetch(API + ALL_POSTS + PER_PAGE + '20' + '&' + PAGE + '1')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ posts: data });
        console.log(this.state);
      });
  }
}
