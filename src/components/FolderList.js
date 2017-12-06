import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Input } from 'reactstrap';
import firebase from 'firebase/app';

import './styles/Navigation.css';

// Pop-out sidebar menu, with header, current user, and folder list
export default class Navigation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createActive: false,
            folderName: '',
            folders: {}
        }
    }


    componentDidMount() {
        // Get list of folders from db
        this.foldersRef = firebase.database().ref('folders');
        this.foldersRef.on('value', (snapshot) => {
            this.setState({ folders: snapshot.val() });
        });
    }

    componentWillUnmount() {
        this.foldersRef.off();
    }

    // testing for clicking the create folder button
    // trying to make it toggle the section for creating folder
    toggleCreateFolder() {
        this.setState({ createActive: !this.state.createActive });
    }

    closeCreateFolder() {
        this.setState({
            createActive: false
        });
    }

    createFolder(event) {
        event.preventDefault(); // don't submit

        // null folder be pushed inside an empty folders root
        let folder = {
            name: this.state.folderName,
            owner: this.props.user.displayName,
            ownerID: this.props.user.uid,
            public: false,
            users: {}
        }

        firebase.database().ref('folders').push(folder)
            .catch((err) => this.setState({ errorMessage: err.message }));

        this.setState({ folderName: '' });
        this.closeCreateFolder();
    }


    updateFolderName(event) {
        this.setState({ folderName: event.target.value });
    }

    render() {
        let user = this.props.user;
        let folders = this.state.folders;
        let folderIDs = [];
        if (folders) {
            folderIDs = Object.keys(folders);
        }

        // Build list of links to channels
        let folderList = folderIDs.map((id) => {
            let folder = folders[id];
            if (user.uid === folder.ownerID || (folder.users && folder.users.hasOwnProperty(user.uid))) {
                return (
                    <li key={id} className='sidebar-folder'>
                        <NavLink to={'/bookmarks/' + id} className='sidebar-link' activeClassName='active-folder' onClick={this.props.closeCallback}>
                            <div><i className='fa fa-folder' aria-hidden='true'></i>{' ' + folder.name}</div>
                        </NavLink>
                    </li>
                );
            }
        });

        // Changes the display of create folder
        let createFolder = "";
        if (!this.state.createActive) {
            createFolder = (<div className='sidebar-link' onClick={() => this.toggleCreateFolder()}><i className='fa fa-plus' aria-hidden='true'></i> Create Folder</div>);
        } else {
            createFolder = (
                <div className='sidebar-link'>
                    <div onClick={() => this.closeCreateFolder()}><i className='fa fa-minus' aria-hidden='true'></i> Cancel</div>
                    {/*<img className="img-fluid" src="https://cdn0.iconfinder.com/data/icons/iconico-3/1024/63.png" alt="folder image" />*/}
                    <div>Folder name: <Input
                        name="text"
                        value={this.state.folderName}
                        onChange={(e) => this.updateFolderName(e)}
                        placeholder='Enter folder name...' />
                    </div>
                    {/* <div onClick={() => this.createFolder()}><i className='fa fa-plus' aria-hidden='true'></i> Add Folder</div> */}
                    <Button
                        color="primary"
                        disabled={this.state.folderName.length === 0}
                        onClick={(e) => this.createFolder(e)}><i className='fa fa-plus' aria-hidden='true'></i> Add Folder</Button>
                </div>
            );
        }

        return (
            <div>
                <h2>Folders</h2>
                <ul className='list-unstyled'>
                    <li className='sidebar-folder'>
                        {createFolder}
                        {folderList}
                    </li>
                </ul>
            </div>
        );
    }
}
