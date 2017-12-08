import React, { Component } from 'react';
import { InputGroup, Table, Button, Row, Form, FormGroup, Input, Label } from 'reactstrap';
//import { Redirect } from 'react-router-dom';
import Bookmark from "./Bookmark.js";
import firebase from 'firebase/app';

export default class LinkList extends Component {
  //takes in one prop folderName and renders list of Bookmark objects
  constructor(props) {
    super(props);
    this.state = {
      createActive: false,
      bookmarkName: '',
      bookmarkURL: '',
      sortValue: '',
      searchValue: ''
    };
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
    this.props.addBookmarkCallback(newBookmark);
    this.setState({bookmarkName: '', bookmarkURL: ''});
  }

  render() {
    // Changes the display of create folder
    let createBookmark = null;
    if (!this.state.createActive) {
      createBookmark = (<div className="col-xs-12 col-sm-4" onClick={() => this.toggleCreateBookmark()}><i className='fa fa-plus' aria-hidden='true'></i> Add Bookmark</div>);
    } else {
      createBookmark = (
        <div className="col-xs-12 col-sm-4">
          <div onClick={() => this.closeCreateBookmark()}><i className='fa fa-minus' aria-hidden='true'></i> Cancel</div>
          <Form>
            <FormGroup>
              <InputGroup>
                <Label for='bookmarkName'>Name:</Label>
                <Input
                  type='text'
                  name="bookmarkName"
                  id='bookmarkName'
                  onChange={(e) => this.handleChange(e)}
                  placeholder='Enter custom name...' />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <Label for='bookmarkURL'>URL:</Label>
                <Input
                  type='text'
                  name="bookmarkURL"
                  id='bookmarkURL'
                  onChange={(e) => this.handleChange(e)}
                  placeholder='Enter URL...' />
              </InputGroup>
            </FormGroup>
            <Button onClick={() => this.createNewBookmark()} disabled={(this.state.bookmarkName.length === 0) && (this.state.bookmarkURL.length === 0)} color="primary"><i className='fa fa-plus' aria-hidden='true'></i> Add Bookmark</Button>
          </Form>
        </div>
      );
    }

    let bookmarks = [];

    if (this.props.links) {
      let bookmarkIDs = Object.keys(this.props.links);
      bookmarkIDs.forEach((id) => {
        let bookmark = this.props.links[id];
        let bookmarkObj = (
          <Bookmark
            key={id}
            bookmark={bookmark}
          />);
        
        // Add filtering here
        if (!this.state.searchVal || this.state.searchVal.length === 0 ||
            (this.state.searchVal && bookmark.Name.indexOf(this.state.searchVal) !== -1) ||
            (this.state.searchVal && bookmark.URL.indexOf(this.state.searchVal) !== -1)) {
          bookmarks.push(bookmarkObj);
        }
      });
    }

    return (
      <div>
        <Row className='ml-2'>
          {createBookmark}
          <div className='col-xs-12 col-sm-4'>
            <InputGroup>
              <Input type="text" name="searchVal" id="searchVal" onChange={(e) => this.handleChange(e)} placeholder='Search bookmarks...' />
            </InputGroup>
          </div>
          <FormGroup className='col-xs-12 col-sm-4'>
            <InputGroup>
              <Label for="sortValue">Sort by</Label>
              <Input type="select" name="select" id="sortValue">
                <option>Recently added</option>
                <option>A-Z</option>
                <option>Z-A</option>
              </Input>
            </InputGroup>
          </FormGroup>
        </Row>
        <Table className='mt-2 table-responsive'>
          {bookmarks &&
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
