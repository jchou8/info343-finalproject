import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Container, Row, Col } from 'reactstrap';

export default class Bookmark extends Component {
  //takes in BookMarkList prop
  constructor(props){
    super(props);
    this.state = {
      url:'',
      name:'',
      time:'',
    };
  }

  render() {
    let date = this.props.date;
    date = new Date( date );
    return (
      <div>
      <Row>
         <Col>this.props.name</Col>
         <Col><a href={this.props.URL}>{this.props.URL}</a></Col>
         <Col>{date}</Col>
      </Row>
      <i class="fa fa-trash-o" onClick={this.props.handleDelete}></i>
      </div>
    );
  }
}
