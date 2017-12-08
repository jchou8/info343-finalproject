import React, { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import Time from 'react-time';

export default class Bookmark extends Component {
  render() {
    let bookmark = this.props.bookmark;
    //todo: needs a handleDelete() callback to linkedlist on the FA icon
    return (
      <tr>
        <td><a href={bookmark.URL} target="_blank">{bookmark.Name}</a></td>
        <td><a href={bookmark.URL} target="_blank">{bookmark.URL}</a></td>
        <td><Time value={bookmark.Date} relative /></td>
        <td>
          <ButtonGroup>
            <Button outline size='sm' color='primary' title='Move bookmark'
              onClick={() => this.props.moveBookmarkCallback(this.props.bookmark)}>
              <i className="fa fa-folder-open-o" aria-label='Move bookmark'></i>
            </Button>
            <Button outline size='sm' color='info' title='Edit bookmark'
              onClick={() => this.props.editBookmarkCallback(this.props.bookmark)}>
              <i className="fa fa-pencil" aria-label='Edit bookmark'></i>
            </Button>
            <Button outline size='sm' color='danger' title='Delete bookmark'
              onClick={() => this.props.deleteBookmarkCallback(this.props.bookmark)}>
              <i className="fa fa-trash-o" aria-label='Delete bookmark'></i>
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    );
  }
}
