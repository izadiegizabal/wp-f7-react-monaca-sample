import React from 'react';
import { Page, Navbar, Preloader, Block } from 'framework7-react';
import renderHTML from 'react-render-html';
import '../css/post.css';
import { API_BASE_URL } from '../js/constants';

// Extract to configuration file
const API = API_BASE_URL + 'posts/';

export default class extends React.Component {
  constructor(props) {
    super(props);
    var postId = props.f7route.params.id;

    this.state = {
      id: postId,
      currentPost: undefined,
    };

    this.loadPost(postId);
  }
  render() {
    return (
      <Page name="product">
        <Navbar
          title={
            this.state.currentPost !== undefined
              ? this.state.currentPost.title.rendered
              : ''
          }
          backLink="Back"
        />
        {this.state.currentPost !== undefined
          ? [
              <Block key="content">
                {renderHTML(this.state.currentPost.content.rendered)}
              </Block>,
              // <div className="loading">
              //   <Preloader key="loading"></Preloader>
              // </div>,
            ]
          : [
              <div className="loading">
                <Preloader key="loading"></Preloader>
              </div>,
            ]}
      </Page>
    );
  }
  loadPost(postId) {
    // Fetch data
    fetch(API + postId)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ currentPost: data });
      });
  }
}
