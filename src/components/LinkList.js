import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Bookmark from "./Bookmark.js";
import firebase from 'firebase/app';

export default class LinkList extends Component {
  //takes in one prop folderName and renders list of Bookmark objects 
  constructor(props) {
    super(props);
    this.state = {
      bookmarkList: []
    };
  }

  componentDidMount() {
    this.linksRef = firebase.database().ref('folders/' + this.props.folderID + '/links');
    this.linksRef.on('value', (snapshot) => {
      this.setState({ bookmarkList: snapshot.val() });
    });
  }

  componentWillUnmount() {
    this.linksRef.off();
  }

  render() {
    
    let bookmarks = null;
    // Create list of messages to display
    if (this.state.bookmarkList) {
        let bookmarkIDs = Object.keys(this.state.bookmarkList);
        bookmarks = bookmarkIDs.map((id) => {
            let bookmark = this.state.bookmarkList[id];
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
