import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Bookmark from "./Bookmark.js";
import firebase from 'firebase/app';

export default class LinkList extends Component {
  //takes in one prop folderName and renders list of Bookmark objects
  constructor(props){
    super(props);
    this.state = {
      bookmarkList: []
    };
<<<<<<< HEAD
    this.state.BookmarkList = firebase.database().ref('folders/' + this.props.folderName +"/links");
  }


  handleDelete(bookmarkURL){
    let arr = this.BookmarkList;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].URL == bookmarkURL){
        arr.splice(i, 1);
        break;
      }
    }
    this.setState({BookmarkList: arr})
  }


  render() {
    if (!this.props.user) {
      // Redirect the user if they're not logged in
      return <Redirect to='/login' />;
    } else {
      let content = [];
        for (var i = 0; i < this.state.BookmarkList.length; i++) {

            content.push(<li><Bookmark bookmark={this.state.bookmarkList[i]} handleDelete={this.handleDelete.bind(this)}/></li>);
            {/*passes in one prop that is a Bookmark object*/}
=======
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
>>>>>>> 13c6d1395b1fffd81e8f6a8175e2548065efdaae

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
}
