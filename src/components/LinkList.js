import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Bookmark from "./Bookmark.js";
import firebase from 'firebase/app';

export default class LinkList extends Component {
  render() {
    let bookmarks = null;

    // Create list of messages to display
    if (this.props.links) {
        let bookmarkIDs = Object.keys(this.props.links);
        bookmarks = bookmarkIDs.map((id) => {
            let bookmark = this.props.links[id];
            return (<Bookmark
                key={id}
                bookmark={bookmark}
            />);
        });
    }
    
  return (
      <div>
        <ul>
          {bookmarks}
        </ul>
      </div>
    );
  }
}
