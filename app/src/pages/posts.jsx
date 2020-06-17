import React from 'react';
import renderHTML from 'react-render-html';
import { Page, Navbar, List, ListItem } from 'framework7-react';
import './css/posts.css';

const API =
  'https://public-api.wordpress.com/wp/v2/sites/monacasampleapp.wordpress.com/';
const ALL_POSTS = 'posts?';
const PER_PAGE = 'per_page=';
const PAGE = 'page=';
let PAGE_NUM = '1';

export default class extends React.Component {
  constructor() {
    super();

    this.state = {
      posts: [],
      allowInfinite: true,
      showPreloader: true,
    };
  }

  render() {
    const { posts } = this.state;

    return (
      <Page
        name="posts"
        infinite
        infiniteDistance={50}
        infinitePreloader={this.state.showPreloader}
        onInfinite={this.loadMore.bind(this)}
      >
        <Navbar title="WP App" />
        <List className="main-list">
          {posts.map((post) => (
            <ListItem
              key={post.id}
              title={renderHTML(post.title.rendered)}
              link={`/post/${post.id}/`}
            />
          ))}
        </List>
      </Page>
    );
  }

  componentDidMount() {
    // Fetch data
    fetch(API + ALL_POSTS + PER_PAGE + '20' + '&' + PAGE + PAGE_NUM)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ posts: data });
      });
  }
  loadMore() {
    const self = this;
    if (!self.state.allowInfinite) return;
    self.setState({ allowInfinite: false });

    PAGE_NUM++;
    fetch(API + ALL_POSTS + PER_PAGE + '20' + '&' + PAGE + PAGE_NUM)
      .then((response) => response.json())
      .then((data) => {
        const items = self.state.posts;
        if (items.length >= 1000) {
          self.setState({ showPreloader: false });
          return;
        }

        data.forEach((post) => {
          items.push(post);
        });

        self.setState({
          items,
          allowInfinite: true,
        });
      });
  }
}
