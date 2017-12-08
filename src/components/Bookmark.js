import React, { Component } from 'react';
import DeleteModal from './DeleteModal';
import Time from 'react-time';

export default class Bookmark extends Component {
  //takes in BookMarkList prop
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.id
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ id: nextProps.id })
  }

  handleDelete() {
    this.props.toggleDeleteModal();
  }

  deleteLink() {
    this.props.deleteBookmarkCallback(this.state.id);
    this.props.toggleModal();
  }

  render() {
    let date = this.props.bookmark.Date;
    //todo: needs a handleDelete() callback to linkedlist on the FA icon
    return (
      <tr>
        <DeleteModal
          open={this.props.modal === 'deleteLink'}
          toggleCallback={() => this.props.toggleModal()}
          deleteCallback={() => this.deleteLink()}
          type='link'
          name={this.props.bookmark.Name}
        />
        <td><a href={this.props.bookmark.URL} target="_blank">{this.props.bookmark.Name}</a></td>
        <td>{this.props.bookmark.URL}</td>
        <td><Time value={this.props.bookmark.Date} relative/></td>
        <td><i className="fa fa-trash-o" onClick={() => this.handleDelete()}></i></td>
        <td><i className="fa fa-pencil"></i></td>

      </tr>
    );
  }
}
