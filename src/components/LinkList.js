import React, { Component } from 'react';
import { InputGroup, Table, Button, Row, Form, FormGroup, Input, Label } from 'reactstrap';
import firebase from 'firebase/app';
import Bookmark from "./Bookmark.js";
import TableHeader from "./TableHeader.js";

export default class LinkList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createActive: false,
      bookmarkName: '',
      bookmarkURL: '',
      searchValue: '',
      sortCol: 'Date',
      sortDir: 'desc',

      bookmarks: []
    };
  }

  componentDidMount() {
    this.updateStateLinks(this.props.links);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateLinks(nextProps.links);
  }

  updateStateLinks(links) {
    let bookmarks = [];
    if (links) {
      bookmarks = Object.keys(links).map((id) => Object.assign(links[id], { id: id }));
    }
    this.setState({ bookmarks: bookmarks }, () => this.sortLinks(this.state.sortCol))
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
      Date: firebase.database.ServerValue.TIMESTAMP,
      Name: this.state.bookmarkName,
      URL: this.state.bookmarkURL
    }

    this.props.addBookmarkCallback(newBookmark);
    this.setState({ bookmarkName: '', bookmarkURL: '' });
  }

  // Sort data based on column
  sortLinks(col) {
    let newState = { sortDir: this.state.sortDir, sortCol: col };

    // Change sort direction if same column is clicked multiple times
    if (this.state.sortCol === col) {
      newState.sortDir = this.state.sortDir === 'asc' ? 'desc' : 'asc';
    }

    let sortFn;
    if (col === 'Date') {
      sortFn = this.sortByDate;
    } else if (col === 'Name') {
      sortFn = this.sortByName;
    } else {
      sortFn = this.sortByURL;
    }

    let reverse = newState.sortDir === 'asc' ? 1 : -1;
    newState.bookmarks = this.state.bookmarks.sort((a, b) => sortFn(a, b, reverse));
    this.setState(newState);
  }

  sortByDate(a, b, reverse) {
    return (b.Date - a.Date) * reverse;
  }

  sortByName(a, b, reverse) {
    let diff = 0;
    if (a.Name < b.Name) {
      diff = -1;
    } else if (a.Name > b.Name) {
      diff = 1;
    } else {
      diff = (a, b, reverse) => this.sortByDate(a, b, -reverse);
    }
    return diff * reverse;
  }

  sortByURL(a, b, reverse) {
    let diff = 0;
    if (a.URL < b.URL) {
      diff = -1;
    } else if (a.URL > b.URL) {
      diff = 1;
    } else {
      diff = (a, b, reverse) => this.sortByName(a, b, -reverse);
    }

    return diff * reverse;
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
                  placeholder='Enter custom name...'
                  value={this.state.bookmarkName}
                  />
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
                  placeholder='Enter URL...' 
                  value={this.state.bookmarkURL}
              />
              </InputGroup>
            </FormGroup>
            <Button onClick={() => this.createNewBookmark()} disabled={(this.state.bookmarkName.length === 0) && (this.state.bookmarkURL.length === 0)} color="primary"><i className='fa fa-plus' aria-hidden='true'></i> Add Bookmark</Button>
          </Form>
        </div>
      );
    }

    let bookmarks = [];
    if (this.state.bookmarks) {
      this.state.bookmarks.forEach((bookmark) => {
        let bookmarkObj = (<Bookmark
          key={bookmark.id}
          bookmark={bookmark}
          deleteBookmarkCallback={(bookmarkId) => this.props.deleteBookmarkCallback(bookmarkId)}
          toggleDeleteModal={this.props.toggleDeleteModal}
          toggleModal={this.props.toggleModal}
          toggleCallback={this.props.toggleCallback}
          modal={this.props.modal}
        />);

        // Filter to search
        if (!this.state.searchValue || this.state.searchValue.length === 0 ||
          (this.state.searchValue && bookmark.Name.indexOf(this.state.searchValue) !== -1) ||
          (this.state.searchValue && bookmark.URL.indexOf(this.state.searchValue) !== -1)) {
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
              <Input type="text" name="searchValue" id="searchValue" onChange={(e) => this.handleChange(e)} placeholder='Search bookmarks...' />
            </InputGroup>
          </div>
        </Row>
        <Table className='mt-2 table-responsive link-table'>
          {bookmarks &&
            <TableHeader
              cols={['Name', 'URL', 'Date']}
              sortCallback={(col) => { this.sortLinks(col) }}
              sortCol={this.state.sortCol}
              sortDir={this.state.sortDir}
            />
          }
          <tbody>
            {bookmarks}
          </tbody>
        </Table>
      </div>
    );
  }
}
