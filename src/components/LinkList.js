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
      searchValue: '',
      bookmarks: []
    };
  }

  componentDidMount() {
    let tempBookmarks = [];
    if (this.props.links) {
      let bookmarkIDs = Object.keys(this.props.links);
      bookmarkIDs.forEach((id) => {
        let bookmark = this.props.links[id];
        let bookmarkObj = (
          <Bookmark
            key={id}
            id={id}
            bookmark={bookmark}
            deleteBookmarkCallback={(bookmarkId) => this.props.deleteBookmarkCallback(bookmarkId)}
            toggleDeleteModal={this.props.toggleDeleteModal}
            toggleModal={this.props.toggleModal}
            toggleCallback={() => this.props.toggleCallback}
            modal={this.props.modal}
          />);
        
        // Add filtering here
        if (!this.state.searchValue || this.state.searchValue.length === 0 ||
            (this.state.searchValue && bookmark.Name.indexOf(this.state.searchValue) !== -1) ||
            (this.state.searchValue && bookmark.URL.indexOf(this.state.searchValue) !== -1)) {
          tempBookmarks.push(bookmarkObj);
        }
      });
    }
      this.setState({bookmarks: tempBookmarks});
  }

  componentWillReceiveProps(nextProps) {
    console.log('test');
    let tempBookmarks = [];
    if (nextProps.links) {
      let bookmarkIDs = Object.keys(nextProps.links);
      bookmarkIDs.forEach((id) => {
        let bookmark = nextProps.links[id];
        let bookmarkObj = (
          <Bookmark
            key={id}
            id={id}
            bookmark={bookmark}
            deleteBookmarkCallback={(bookmarkId) => nextProps.deleteBookmarkCallback(bookmarkId)}
            toggleDeleteModal={nextProps.toggleDeleteModal}
            toggleModal={nextProps.toggleModal}
            toggleCallback={() => nextProps.toggleCallback}
            modal={nextProps.modal}
          />);
        
        // Add filtering here
        if (!this.state.searchValue || this.state.searchValue.length === 0 ||
            (this.state.searchValue && bookmark.Name.indexOf(this.state.searchValue) !== -1) ||
            (this.state.searchValue && bookmark.URL.indexOf(this.state.searchValue) !== -1)) {
          tempBookmarks.push(bookmarkObj);
        }
      });
    }
      this.setState({bookmarks: tempBookmarks});
  }


  handleChange(event) {
    let newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);

    let tempBookmarks = [];
    if (this.props.links) {
      let bookmarkIDs = Object.keys(this.props.links);
      bookmarkIDs.forEach((id) => {
        let bookmark = this.props.links[id];
        let bookmarkObj = (
          <Bookmark
            key={id}
            id={id}
            bookmark={bookmark}
            deleteBookmarkCallback={(bookmarkId) => this.props.deleteBookmarkCallback(bookmarkId)}
            toggleDeleteModal={this.props.toggleDeleteModal}
            toggleModal={this.props.toggleModal}
            toggleCallback={() => this.props.toggleCallback}
            modal={this.props.modal}
          />);
        
        // Add filtering here
        if (!event.target.value || event.target.value.length === 0 ||
            (event.target.value && bookmark.Name.indexOf(event.target.value) !== -1) ||
            (event.target.value && bookmark.URL.indexOf(event.target.value) !== -1)) {
          tempBookmarks.push(bookmarkObj);
        }
      });
    }
      this.setState({bookmarks: tempBookmarks});
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

  sortByDate() {
    this.props.sortByDateCallBack();
    let tempBookmarks = this.state.bookmarks;
    tempBookmarks.sort((a,b) => {
      if(a['props']['bookmark']['Date'] < b['props']['bookmark']['Date']) {
        return 1;
      }
      if(a['props']['bookmark']['Date'] > b['props']['bookmark']['Date']) {
        return -1;
      }
      return 0;
    })
    this.setState({bookmarks: tempBookmarks})
  }

  sortByName() {
    this.props.sortByNameCallBack();
    let tempBookmarks = this.state.bookmarks;
    tempBookmarks.sort((a,b) => {
      if(a['props']['bookmark']['Name'] < b['props']['bookmark']['Name']) {
        return -1;
      }
      if(a['props']['bookmark']['Name'] > b['props']['bookmark']['Name']) {
        return 1;
      }
      return 0;
    })
    this.setState({bookmarks: tempBookmarks})
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

    // let bookmarks = [];
    
    // if (this.props.links) {
    //   let bookmarkIDs = Object.keys(this.props.links);
    //   bookmarkIDs.forEach((id) => {
    //     let bookmark = this.props.links[id];
    //     let bookmarkObj = (
    //       <Bookmark
    //         key={id}
    //         id={id}
    //         bookmark={bookmark}
    //         deleteBookmarkCallback={(bookmarkId) => this.props.deleteBookmarkCallback(bookmarkId)}
    //         toggleDeleteModal={this.props.toggleDeleteModal}
    //         toggleModal={this.props.toggleModal}
    //         toggleCallback={() => this.props.toggleCallback}
    //         modal={this.props.modal}
    //       />);
        
    //     // Add filtering here
    //     if (!this.state.searchVal || this.state.searchVal.length === 0 ||
    //         (this.state.searchVal && bookmark.Name.indexOf(this.state.searchVal) !== -1) ||
    //         (this.state.searchVal && bookmark.URL.indexOf(this.state.searchVal) !== -1)) {
    //       bookmarks.push(bookmarkObj);
    //     }
    //   });
      // this.setState({bookmarks: bookmarks})
      // console.log(bookmarks[0]['props']['bookmark']['Name'])
      // bookmarks.sort((a,b) => {
      //   if(a['props']['bookmark']['Name'] < b['props']['bookmark']['Name']) {
      //     return -1;
      //   }
      //   if(a['props']['bookmark']['Name'] > b['props']['bookmark']['Name']) {
      //     return 1;
      //   }
      //   return 0;
      // })
      // console.log(bookmarks)
    // }
    console.log(this.state.searchValue);
    return (
      <div>
        <Row className='ml-2'>
          {createBookmark}
          <div className='col-xs-12 col-sm-4'>
            <InputGroup>
              <Input type="text" name="searchValue" id="searchValue" onChange={(e) => this.handleChange(e)} placeholder='Search bookmarks...' />
            </InputGroup>
          </div>
          {/* <FormGroup className='col-xs-12 col-sm-4'>
            <InputGroup>
              <Label for="sortValue">Sort by</Label>
              <Input type="select" name="select" id="sortValue">
                <option>Recently added</option>
                <option>A-Z</option>
                <option>Z-A</option>
              </Input>
            </InputGroup>
          </FormGroup> */}
        </Row>
        <Table className='mt-2 table-responsive'>
          {this.state.bookmarks &&
            <thead>
              <tr>
                <th><Button onClick={() => this.sortByDate()}>Date</Button></th>
                <th><Button onClick={() => this.sortByName()}>Name</Button></th>
                <th>URL</th>
                <th></th>
              </tr>
            </thead>
          }
          <tbody>
            {this.state.bookmarks}
          </tbody>
        </Table>
      </div>
    );
  }
}
