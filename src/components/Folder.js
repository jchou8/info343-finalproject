import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, InputGroup } from 'reactstrap';
import firebase from 'firebase/app';
import FolderHeader from './FolderHeader';
import LinkList from './LinkList';

export default class Folder extends Component {

    constructor(props){
        super(props);
        this.state = {
          searchValue: null
        };
    }

    updateSearchVal(event) {
        this.setState({searchValue: event.target.value});
        console.log(this.state.searchValue);
        console.log(firebase.database().ref('folders/' + this.props.match.params.folderID))
    }

    render() {
        return (
            <div>
                <FolderHeader/>
                <InputGroup>
                <Input onChange={(e) => this.updateSearchVal(e)} placeholder='search bookmark...' /><Button><i className='fa fa-search' aria-hidden='true'></i></Button>
                </InputGroup>
                <LinkList folderID={this.props.match.params.folderID} />
            </div>
        );
    }
}