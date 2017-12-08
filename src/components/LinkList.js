import React, { Component } from 'react';
import { InputGroup, Table, Button, Row, Form, FormGroup, Input, Label } from 'reactstrap';
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
      searchValue: '',
      bookmarkList: [],
      bookmarkIds: [],
      bookmarks: null,
      displayBookmarks: null
    };
  }

  componentDidMount() {
    this.linksRef = firebase.database().ref('folders/' + this.props.folderID + '/links');
    this.linksRef.on('value', (snapshot) => {
      let tempList = this.state.bookmarkList;
      tempList.push(snapshot.val());
      this.setState({ bookmarkList: tempList });
      this.setState({ bookmarkIds: Object.keys(snapshot.val()) });
    });

    if (this.props.links) {
      let bookmarkIDs = Object.keys(this.props.links);
      // Sets state for all bookmarks in database
      this.setState({bookmarks: bookmarkIDs.map((id) => {
          let bookmark = this.props.links[id];
          let bookmarkObj = (<Bookmark
          key={id}
          bookmark={bookmark}
      />);
          return (<Bookmark
              key={id}
              bookmark={bookmark}
          />);
      })});

      // Sets state for bookmarks to be displayed
      this.setState({displayBookmarks: bookmarkIDs.map((id) => {
        let bookmark = this.props.links[id];
        let bookmarkObj = (<Bookmark
        key={id}
        bookmark={bookmark}
    />);
        return (<Bookmark
            key={id}
            bookmark={bookmark}
        />);
    })});
  }
  
  }

  componentWillUnmount() {
    this.linksRef.off();
  }

  componentWillReceiveProps(nextProps) {
    // updating the bookmarkList prop everytime the user switches to a different folder
    firebase.database().ref('folders/'+ nextProps.folderID+'/links')
    .on('value', (snapshot) => {
      let tempList = this.state.bookmarkList;
      tempList.push(snapshot.val());
      this.setState({ bookmarkList: tempList });
      this.setState({ bookmarkIds: Object.keys(snapshot.val()) });
    })
    this.setState({links: nextProps.links});
    if (this.props.links) {
      let bookmarkIDs = Object.keys(nextProps.links);
      // Sets state for total bookmarks in database
      this.setState({bookmarks: bookmarkIDs.map((id) => {
          let bookmark = nextProps.links[id];
          let bookmarkObj = (<Bookmark
          key={id}
          bookmark={bookmark}
      />);
          return (<Bookmark
              key={id}
              bookmark={bookmark}
          />);
      })});

      // Sets state for bookmarks to be displayed
      this.setState({displayBookmarks: bookmarkIDs.map((id) => {
        let bookmark = this.props.links[id];
        let bookmarkObj = (<Bookmark
        key={id}
        bookmark={bookmark}
    />);
        return (<Bookmark
            key={id}
            bookmark={bookmark}
        />);
    })});
    }
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

  updateSearchVal(event) {
    this.setState({ searchValue: event.target.value });
  }
 
  searchVal(event) {
    // If the user typed in something, go look for it
    if(this.state.searchValue.length > 0) {
      let bookmarkArray = [];
      this.state.bookmarkIds.forEach((id) => {
        bookmarkArray.push(this.state.bookmarkList[0][id]);
      })
      let index = 0;
      this.setState({displayBookmarks: []});
      bookmarkArray.forEach((bookmark) => {
        if(this.state.searchValue.toLowerCase() == bookmark["Name"].toLowerCase()) {
          let newBookmark = (<Bookmark
          key={this.state.bookmarkIds[index]}
          bookmark={bookmark}/>);
          let tempBookmarksArr = [];
          tempBookmarksArr.push(newBookmark);
          this.setState({displayBookmarks: tempBookmarksArr});
        }
        index++;
      })
    // If there's no input, show all bookmarks
    } else {
      this.setState({displayBookmarks: this.state.bookmarks});
    }
  }

  render() {
    console.log(this.props);
    // Changes the display of create folder
    let createBookmark = "";
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
                  <Button onClick={() => this.createNewBookmark()} disabled={(this.state.bookmarkName.length===0) && (this.state.bookmarkURL.length===0)} color="primary"><i className='fa fa-plus' aria-hidden='true'></i> Add Bookmark</Button>
                </Form>
            </div>
        );
    }
    
    return (
      <div>
        <Row className='ml-2'>
        
          {createBookmark}
            <div className='col-xs-12 col-sm-4'>
              <InputGroup>
                  <Input onChange={(e) => this.updateSearchVal(e)} placeholder='search bookmark...' /><Button onClick={(e) => this.searchVal(e)}><i className='fa fa-search' aria-hidden='true'></i></Button>
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
            {this.state.displayBookmarks}
          </tbody>
        </Table>
      </div>
    );
  }
}
