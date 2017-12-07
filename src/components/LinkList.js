import React, { Component } from 'react';
import { Table, Button, Row, Form, FormGroup, Input, Label } from 'reactstrap';
//import { Redirect } from 'react-router-dom';
import Bookmark from "./Bookmark.js";
import firebase from 'firebase/app';

export default class LinkList extends Component {
  //takes in one prop folderName and renders list of Bookmark objects
  constructor(props){
    super(props);
    this.state = {
      createActive: false,
      bookmarkName: '',
      bookmarkURL: '',
      sortValue:'',
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

  componentWillReceiveProps(nextProps) {
    // updating the bookmarkList prop everytime the user switches to a different folder
    firebase.database().ref('folders/'+ nextProps.folderID+'/links')
    .on('value', (snapshot) => {
      this.setState({ bookmarkList: snapshot.val() });
    })
  }

  handleChange(event) {
    let newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  toggleCreateBookmark() {
    this.setState({ createActive: !this.state.createActive });
  }

  closeCreateBookmark() {
    this.setState({
        createActive: false
    });
  }

  createNewBookmark() {
    let newBookmark = {
      Date: new Date().toLocaleDateString("en-US"),
      Name: this.state.bookmarkName,
      URL: this.state.bookmarkURL
    }
    firebase.database().ref('folders/'+ this.props.folderID+'/links').push(newBookmark);
  }

  render() {
    // Changes the display of create folder
    let createBookmark = "";
    if (!this.state.createActive) {
        createBookmark = (<div onClick={() => this.toggleCreateBookmark()}><i className='fa fa-plus' aria-hidden='true'></i> Add Bookmark</div>);
    } else {
        createBookmark = (
            <div>
                <div onClick={() => this.closeCreateBookmark()}><i className='fa fa-minus' aria-hidden='true'></i> Cancel</div>
                <Form>
                  <FormGroup>
                    <Label for='bookmarkName'>Name:</Label>
                    <Input
                      type='text'
                      name="bookmarkName"
                      id='bookmarkName'
                      onChange={(e) => this.handleChange(e)}
                      placeholder='Enter custom name...' />
                  </FormGroup>
                  <FormGroup>
                    <Label for='bookmarkURL'>URL:</Label>
                    <Input
                      type='text'
                      name="bookmarkURL"
                      id='bookmarkURL'
                      onChange={(e) => this.handleChange(e)}
                      placeholder='Enter URL...' />
                  </FormGroup>
                  <Button onClick={() => this.createNewBookmark()} disabled={(this.state.bookmarkName.length===0) && (this.state.bookmarkURL.length===0)} color="primary"><i className='fa fa-plus' aria-hidden='true'></i> Add Bookmark</Button>
                </Form>
            </div>
        );
    }


    let bookmarks = null;

    // Create list of messages to display
    if (this.props.links) {
        let bookmarkIDs = Object.keys(this.props.links);
        bookmarks = bookmarkIDs.map((id) => {
            let bookmark = this.props.links[id];
            return (<Bookmark
                key={id}
                bookmark={bookmark}
            />);
        });
    }
    
    return (
      <div>
        <Row className='ml-2 col-12'>
          {createBookmark}
          <FormGroup>
            <Label for="sortValue">Sort by</Label>
            <Input type="select" name="select" id="sortValue">
              <option>Recently added</option>
              <option>A-Z</option>
              <option>Z-A</option>
            </Input>
          </FormGroup>
        </Row>
        <Table className='mt-2 table-responsive'>
        {this.state.bookmarkList &&
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>URL</th>
              <th></th>
            </tr>
          </thead>
        }  
          <tbody>
            {bookmarks}
          </tbody>
        </Table>
      </div>
    );
  }
}
