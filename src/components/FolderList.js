import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Button, Input } from 'reactstrap';

// List of folders in sidebar, along with form to create new folders
class FolderList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createActive: false,
            folderName: ''
        }
    }

    // Toggle the form to create a new folder
    toggleCreateFolder() {
        this.setState({ createActive: !this.state.createActive });
    }

    // Creates a folder
    createFolder(event) {
        event.preventDefault(); // don't submit

        // Create new empty folder
        let folder = {
            name: this.state.folderName,
            owner: this.props.user.displayName,
            ownerID: this.props.user.uid,
            public: false,
            users: {}
        }

        this.props.createFolderCallback(folder);
        this.setState({ folderName: '' });
        this.toggleCreateFolder();
    }

    // Alter value of input box to create a new folder
    updateFolderName(event) {
        this.setState({ folderName: event.target.value });
    }

    render() {
        let user = this.props.user;
        let folders = this.props.folders;
        let folderIDs = [];
        if (folders) {
            folderIDs = Object.keys(folders);
        }

        // Build list of links to owned folders
        let folderList = [];
        let sharedFolderList = [];

        folderIDs.forEach((id) => {
            let folder = folders[id];
            let folderObj = (
                <li key={id} className='sidebar-folder'>
                    <NavLink to={'/bookmarks/' + id} className='sidebar-link' activeClassName='active-folder' onClick={this.props.closeCallback}>
                        <div><i className='fa fa-folder' aria-hidden='true'></i>{' ' + folder.name}</div>
                    </NavLink>
                </li>);

            if (user.uid === folder.ownerID) {
                folderList.push(folderObj);
            } else {
                sharedFolderList.push(folderObj);
            }
        });

        // Changes the display of create folder
        let createFolder = "";
        if (!this.state.createActive) {
            createFolder = (<div className='sidebar-link' onClick={() => this.toggleCreateFolder()}><i className='fa fa-plus' aria-hidden='true'></i> Create Folder</div>);
        } else {
            createFolder = (
                <div className='sidebar-link'>
                    <div onClick={() => this.toggleCreateFolder()}><i className='fa fa-minus' aria-hidden='true'></i> Cancel</div>
                    <div>Folder name: <Input
                        name="text"
                        value={this.state.folderName}
                        onChange={(e) => this.updateFolderName(e)}
                        placeholder='Enter folder name...' />
                    </div>
                    <Button
                        color="primary"
                        disabled={this.state.folderName.length === 0 || this.state.folderName.length > 30}
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
                    </li>
                    {folderList}
                </ul>

                {sharedFolderList.length > 0 &&
                    <div>
                        <h2>Shared with you</h2>
                        <ul className='list-unstyled'>
                            {sharedFolderList}
                        </ul>
                    </div>
                }
            </div>
        );
    }
}

export default withRouter(FolderList);