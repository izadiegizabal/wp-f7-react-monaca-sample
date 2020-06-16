import React from 'react';
import { Page, Navbar, List, ListItem } from 'framework7-react';

export default class extends React.Component {
  constructor() {
    super();

    this.state = {
      products: this.$f7.data.products,
    };
  }
  render() {
    return (
      <Page name="posts">
        <Navbar title="WP App" />
        <List>
          {this.state.products.map((product) => (
            <ListItem
              key={product.id}
              title={product.title}
              link={`/post/${product.id}/`}
            />
          ))}
        </List>
      </Page>
    );
  }
}
