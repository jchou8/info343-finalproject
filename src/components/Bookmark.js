import React, { Component } from 'react';
//import { Container, Row, Col } from 'reactstrap';

export default class Bookmark extends Component {
  //takes in BookMarkList prop
  constructor(props){
    super(props);
  }

  render() {
    let date = this.props.bookmark.Date;
    //todo: needs a handleDelete() callback to linkedlist on the FA icon
    return (
        <tr>
          <td>{this.props.bookmark.Date}</td>
          <td><a href={this.props.bookmark.URL} target="_blank">{this.props.bookmark.Name}</a></td>
          <td>{this.props.bookmark.URL}</td>
          <td><i className="fa fa-trash-o"></i></td>
        </tr>
    );
  }
}
