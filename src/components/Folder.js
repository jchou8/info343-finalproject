import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, InputGroup } from 'reactstrap';
import Spinner from 'react-spinkit';

import firebase from 'firebase/app';

import FolderHeader from './FolderHeader';
import LinkList from './LinkList';
import ShareFolderModal from './ShareFolderModal';
import DeleteModal from './DeleteModal';
import EditFolderModal from './EditFolderModal';


import './styles/Folder.css';

export default class Folder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            folder: {},
            shareModal: false,
            deleteModal: false,
            editModal: false,
            loading: true,

            // Search bar
            searchValue: null,
            links: null
        };
    }

    // Add reference to the current folder's links
    addDBRef(folderID) {
        this.linksRef = firebase.database().ref('folders/' + folderID);
        this.linksRef.on('value', (snapshot) => {
            this.setState({ folder: snapshot.val(), loading: false });
        });
    }

    componentDidMount() {
        // Add reference to current folder
        this.addDBRef(this.props.match.params.folderID);
    }

    // Update ref when folder changes
    componentWillReceiveProps(nextProps) {
        let folderID = nextProps.match.params.folderID;
        this.setState({ loading: true });

        // Remove previous references and add references to new folder
        this.linksRef.off();
        this.addDBRef(folderID);
    }

    componentWillUnmount() {
        this.linksRef.off();
    }

    toggleShareModal() {
        this.setState({ shareModal: !this.state.shareModal });
    }

    toggleDeleteModal() {
        this.setState({ deleteModal: !this.state.deleteModal });
    }

    toggleEditModal() {
        this.setState({ editModal: !this.state.editModal });
    }

    updateSearchVal(event) {
        this.setState({ searchValue: event.target.value });
        console.log(this.state.searchValue);
        this.curFolder = firebase.database().ref('folders/' + this.props.match.params.folderID);
        // Checks that we're in the right folder (to be modified once bookmarks can be added)
        this.curFolder.on('value', (snapshot) => {
            console.log(snapshot.val());
            this.setState({ links: snapshot.val() });
        });
    }

    render() {
        let content = null;
        if (this.state.loading) {
        content = (<div><Spinner name='circle' color='steelblue' fadeIn='none' aria-label='Loading...' /></div> );
        } else {
            content = (<div>
                <FolderHeader folder={this.state.folder}
                    toggleShareModal={() => this.toggleShareModal()}
                    toggleEditModal={() => this.toggleEditModal()}
                    toggleDeleteModal={() => this.toggleDeleteModal()}
                />

                <div className='row'>
                    <div className="col-sm-4"></div>
                    <div className='col-sm-4'>
                        <InputGroup>
                            <Input onChange={(e) => this.updateSearchVal(e)} placeholder='search bookmark...' /><Button><i className='fa fa-search' aria-hidden='true'></i></Button>
                        </InputGroup>
                    </div>
                </div>

                <LinkList folderID={this.props.match.params.folderID} />

                <ShareFolderModal
                    open={this.state.shareModal}
                    messages={this.state.messages}
                    toggleCallback={() => this.toggleShareModal()}
                />

                <DeleteModal
                    open={this.state.deleteModal}
                    toggleCallback={() => this.toggleDeleteModal()}
                    deleteCallback={() => this.deleteFolder()}
                    type='folder'
                />

                <EditFolderModal
                    open={this.state.editModal}
                    toggleCallback={() => this.toggleEditModal()}
                    editCallback={(newText) => this.editName(newText)}
                    folderName={this.state.folder.name}
                />
            </div>);
        }

        return (
            <div>
                {// this.props.user &&
                    content
                }
            </div >
        );
    }
}
