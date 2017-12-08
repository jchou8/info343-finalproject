import React, { Component } from 'react';
import DeleteModal from './DeleteModal';
import Time from 'react-time';

export default class Bookmark extends Component {
  confirmDelete() {
    this.props.deleteBookmarkCallback(this.props.bookmark);
  }

  render() {
    let bookmark = this.props.bookmark;
    //todo: needs a handleDelete() callback to linkedlist on the FA icon
    return (
      <tr>
        <td><a href={bookmark.URL} target="_blank">{bookmark.Name}</a></td>
        <td>{bookmark.URL}</td>
        <td><Time value={bookmark.Date} relative /></td>
        <td><i className="fa fa-trash-o" onClick={() => this.confirmDelete()}></i></td>
        <td><i className="fa fa-pencil"></i></td>
      </tr>
    );
  }
}
