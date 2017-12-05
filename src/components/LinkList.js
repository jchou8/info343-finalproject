import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class LinkList extends Component {
  render() {
    if (!this.props.user) {
      // Redirect the user if they're not logged in
      return <Redirect to='/login' />;
    } else {
      return (
        <div>
        </div>
      );
    }
  }
}
