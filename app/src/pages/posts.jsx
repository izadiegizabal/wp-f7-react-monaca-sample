import React from 'react';
import renderHTML from 'react-render-html';
import { Page, Navbar, List, ListItem } from 'framework7-react';
import './css/posts.css';

// Extract to configuration file
const API = 'http://monacasamplewp.c1.biz/wp-json/wp/v2/';
const ALL_POSTS = 'posts?';
const PER_PAGE = 'per_page=';
const BASE_API = API + ALL_POSTS + '&' + PER_PAGE + '20' + '&';
const PAGE = 'page=';
let PAGE_NUM = '1';

export default class extends React.Component {
  constructor(props) {
    super();

    this.state = JSON.parse(localStorage.getItem(props.$f7route.path)) || {
      posts: [],
      allowInfinite: true,
      showPreloader: true,
      currentPage: props.$f7route.path,
    };

    this.loadPosts(props.$f7route.path);
  }

  render() {
    const { posts } = this.state;

    return (
      <Page
        ptr
        onPtrRefresh={this.loadPosts.bind(this)}
        name="posts"
        infinite
        infiniteDistance={50}
        infinitePreloader={this.state.showPreloader}
        onInfinite={this.loadMore.bind(this)}
      >
        <Navbar title={this.state.currentPage} />
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

  loadPosts(done) {
    const { currentPage } = this.state;

    // Fetch data
    fetch(BASE_API + this.getCategoryId() + PAGE + PAGE_NUM)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ posts: data });
        localStorage.setItem(
          currentPage,
          JSON.stringify({
            posts: data,
            allowInfinite: true,
            showPreloader: true,
            currentPage: currentPage,
          })
        );
        if (typeof done === 'function') done();
      });
  }
  getCategoryId() {
    const { currentPage } = this.state;
    let cat = '';
    switch (currentPage) {
      case '/news/':
        cat = 'categories=2&';
        break;
      case '/reviews/':
        cat = 'categories=3&';
        break;
      default:
        break;
    }
    return cat;
  }
  loadMore() {
    const self = this;
    const { currentPage } = this.state;
    if (!self.state.allowInfinite) return;
    self.setState({ allowInfinite: false });

    PAGE_NUM++;
    fetch(BASE_API + this.getCategoryId() + PAGE + PAGE_NUM)
      .then((response) => response.json())
      .then((data) => {
        const items = self.state.posts;
        if (items.length >= 1000) {
          self.setState({ showPreloader: false });

          localStorage.setItem(
            currentPage,
            JSON.stringify({
              posts: this.state.posts,
              allowInfinite: true,
              showPreloader: false,
              currentPage: currentPage,
            })
          );
          return;
        }

        data.forEach((post) => {
          items.push(post);
        });

        self.setState({
          items,
          allowInfinite: true,
        });

        localStorage.setItem(
          currentPage,
          JSON.stringify({
            posts: items,
            allowInfinite: true,
            showPreloader: true,
            currentPage: currentPage,
          })
        );
      });
  }
}
