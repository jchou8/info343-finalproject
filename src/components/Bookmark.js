import React, { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import Time from 'react-time';

// Displays one bookmark as a table row
export default class Bookmark extends Component {
  render() {
    let bookmark = this.props.bookmark;
    return (
      <tr className='row'>
        <td className='bookmark-name text-left col-xs-12 col-sm-6 col-md-3 col-Name'><a href={bookmark.URL} target="_blank">
          <img src={'https://www.google.com/s2/favicons?domain=' + bookmark.URL} alt='Favicon' />
          {' ' + bookmark.Name}</a>
        </td>
        <td className='text-left col-xs-12 col-sm-6 col-md-3 col-URL'><a href={bookmark.URL} target="_blank">{bookmark.URL}</a></td>
        <td className='col-xs-6 col-sm-6 col-md-3 col-Added'><Time value={bookmark.Date} relative /></td>
        {this.props.canEdit && <td className='col-xs-6 col-sm-6 col-md-3'>
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
        </td>}
      </tr>
    );
  }
}
