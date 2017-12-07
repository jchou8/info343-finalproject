import React, { Component } from 'react';
//import { Container, Row, Col } from 'reactstrap';

export default class Bookmark extends Component {
  render() {
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
