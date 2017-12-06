import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Bookmark from "./Bookmark.js";
import firebase from 'firebase/app';

export default class LinkList extends Component {
<<<<<<< HEAD
  //takes in one prop folderName and renders list of Bookmark objects
  constructor(props){
=======
  //takes in one prop folderName and renders list of Bookmark objects 
  constructor(props) {
>>>>>>> 7590e09d973205b84b84103a9d744e5f5e84caff
    super(props);
    this.state = {
      BookmarkList: [],
      shared: false
    };
    this.state.BookmarkList = firebase.database().ref('folders/' + this.props.folderName);
  }
  
  render() {
<<<<<<< HEAD
    if (!this.props.user) {
      // Redirect the user if they're not logged in
      return <Redirect to='/login' />;
    } else {
      let content = [];
        for (var i = 0; i < this.state.BookmarkList.length; i++) {
          
            content.push(<li><Bookmark bookmark={this.state.bookmarkList[i]} /></li>);
            {/*passes in one prop that is a Bookmark object*/}

      }
=======
    let content = [];
    for (var i = 0; i < this.state.BookmarkList.length; i++) {
      <li>
        content.push(<Bookmark bookmark={this.state.bookmarkList[i]} />);
            {/*passes in one prop that is a Bookmark object*/}
      </li>
    }
>>>>>>> 7590e09d973205b84b84103a9d744e5f5e84caff

    return (
      <div>
        <ol>
          {content}
        </ol>
      </div>
    );
  }
}
