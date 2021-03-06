import React, { Component } from 'react';
import { Alert, InputGroup, Table, Row, Input, InputGroupAddon } from 'reactstrap';
import firebase from 'firebase/app';
import Bookmark from "./Bookmark.js";
import TableHeader from "./TableHeader.js";
import CreateBookmark from "./CreateBookmark.js";

// Displays a table with a list of bookmarks
export default class LinkList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createActive: false,
      searchValue: '',
      sortCol: 'Added',
      sortDir: 'asc',

      bookmarks: []
    };
  }

  componentDidMount() {
    this.updateStateLinks(this.props.links);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateLinks(nextProps.links);
  }

  // Update list of links to display
  updateStateLinks(links) {
    let bookmarks = [];
    if (links) {
      bookmarks = Object.keys(links).map((id) => Object.assign(links[id], { id: id }));
    }
    this.setState({ bookmarks: bookmarks }, () => this.sortLinks(this.state.sortCol, true))
  }

  // Update state to reflect text inputs
  handleChange(event) {
    let newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  // Toggle menu to create bookmarks
  toggleCreateBookmark() {
    this.setState({ createActive: !this.state.createActive });
  }

  // Add a new bookmark
  createNewBookmark(name, url) {
    let newBookmark = {
      Date: firebase.database.ServerValue.TIMESTAMP,
      Name: name,
      URL: url
    }

    this.props.addBookmarkCallback(newBookmark);
  }

  // Sort data based on column
  sortLinks(col, dontSwitch) {
    let newState = { sortDir: this.state.sortDir, sortCol: col };

    // Change sort direction if same column is clicked multiple times
    if (this.state.sortCol === col && !dontSwitch) {
      newState.sortDir = this.state.sortDir === 'asc' ? 'desc' : 'asc';
    }

    let sortFn;
    if (col === 'Added') {
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

  // Sort by date
  sortByDate(a, b, reverse) {
    return (b.Date - a.Date) * reverse;
  }

  // Sort by name, break ties with date
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

  // Sort by url, break ties with name
  sortByURL(a, b, reverse) {
    // Remove protocol from URLs
    let URLa = a.URL.replace(/(^\w+:|^)\/\//, '');
    let URLb = b.URL.replace(/(^\w+:|^)\/\//, '');
    let diff = 0;
    if (URLa < URLb) {
      diff = -1;
    } else if (URLa > URLb) {
      diff = 1;
    } else {
      diff = (a, b, reverse) => this.sortByName(a, b, -reverse);
    }

    return diff * reverse;
  }

  render() {
    let canEdit = this.props.permission === 'owner' || this.props.permission === 'edit';
    let bookmarks = [];

    // Build list of bookmarks to render
    if (this.state.bookmarks) {
      this.state.bookmarks.forEach((bookmark) => {
        let bookmarkObj = (<Bookmark
          key={bookmark.id}
          bookmark={bookmark}
          deleteBookmarkCallback={(bookmark) => this.props.deleteBookmarkCallback(bookmark)}
          editBookmarkCallback={(bookmark) => this.props.editBookmarkCallback(bookmark)}
          moveBookmarkCallback={(bookmark) => this.props.moveBookmarkCallback(bookmark)}
          toggleDeleteModal={this.props.toggleDeleteModal}
          modal={this.props.modal}
          canEdit={canEdit}
        />);

        // Filter to search
        if (!this.state.searchValue || this.state.searchValue.length === 0 ||
          (this.state.searchValue && bookmark.Name.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1) ||
          (this.state.searchValue && bookmark.URL.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1)) {
          bookmarks.push(bookmarkObj);
        }
      });
    }

    return (
      <div>
        <Row className='ml-2 linklist-controls'>
          {canEdit && <CreateBookmark
            open={this.state.createActive}
            createBookmarkCallback={(name, url) => this.createNewBookmark(name, url)}
            toggleCreateBookmark={() => this.toggleCreateBookmark()}
          />}
          <div className='col-xs-12 col-sm-6 search-bar'>
            <InputGroup>
              <InputGroupAddon aria-hidden='true'><i className='fa fa-search'></i></InputGroupAddon>
              <Input type="text" name="searchValue" id="searchValue" onChange={(e) => this.handleChange(e)} placeholder='Search this folder...' />
            </InputGroup>
          </div>
        </Row>
        {bookmarks && bookmarks.length !== 0 &&
          <div className='container'>
            <Table hover size='sm'>
              <TableHeader
                cols={['Name', 'URL', 'Added']}
                sortCallback={(col) => { this.sortLinks(col) }}
                sortCol={this.state.sortCol}
                sortDir={this.state.sortDir}
              />
              <tbody>
                {bookmarks}
              </tbody>
            </Table>
          </div>
        }

        {(!bookmarks || bookmarks.length === 0) &&
          <Alert color='warning'>No bookmarks have been added to this folder yet!</Alert>
        }

      </div>
    );
  }
}
