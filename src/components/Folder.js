import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Alert, Button, Input, InputGroup } from 'reactstrap';
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
            folderID: '',
            modal: '',
            loading: true,

            shareError: ''
        };
    }

    // Add reference to the current folder's links
    addDBRef(folderID) {
        this.linksRef = firebase.database().ref('folders/' + folderID);
        this.linksRef.on('value', (snapshot) => {
            this.setState({ folder: snapshot.val(), folderID: folderID, loading: false });
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

    toggleModal(modal) {
        let newModal = this.state.modal === modal ? '' : modal;
        this.setState({ modal: newModal });
    }

    deleteFolder() {
        this.setState({ loading: true });

        // Remove ref from database
        this.linksRef.remove()
            .catch((error) => {
                console.log(error);
                this.setState({ error: error.message });
            })
            .then(() => {
                this.setState({ loading: false });
            });
    }

    togglePublic() {
        this.linksRef.update({
            public: !this.state.folder.public
        });
    }

    editName(newName) {
        if (newName !== this.state.folder.name) {
            this.setState({ loading: true });

            this.linksRef.update({
                name: newName
            })
                .catch((error) => {
                    console.log(error);
                    this.setState({ error: error.message });
                })
                .then(() => {
                    this.setState({ loading: false });
                });
        }
    }

    shareFolder(email, mode) {
        this.setState({ shareError: '' });
        firebase.database().ref('emailToUID/' + email.replace('.', ',')).once('value')
            .then((snapshot) => {
                let userID = snapshot.val();
                if (userID === null) {
                    this.setState({ shareError: 'User with that email does not exist.' });
                } else if (userID === this.props.user.uid) {
                    this.setState({ shareError: 'Cannot share a folder with yourself.' });
                } else if (mode !== 'remove') {
                    this.linksRef.child('/users/' + userID).set(mode);
                    firebase.database().ref('userPermissions/' + userID + '/permissions/' + this.state.folderID).set(mode);
                } else {
                    this.linksRef.child('/users/' + userID).remove();
                    firebase.database().ref('userPermissions/' + userID + '/permissions/' + this.state.folderID).remove();
                }
            });
    }

    addBookmark(bookmark) {
        this.linksRef.child('/links').push(bookmark);
    }

    deleteBookmark(bookmarkId) {
        firebase.database().ref('folders/' + this.state.folderID + '/links/' + bookmarkId).remove();
    }

    render() {
        let content = null;
        if (this.state.loading) {
            content = <Spinner name='circle' color='steelblue' fadeIn='none' aria-label='Loading...' />;
        } else if (!this.state.folder) {
            content = <Redirect to='/' />;
        } else if (this.props.user || (this.state.folder && this.state.folder.public)) {
            content = (<div>
                <FolderHeader folder={this.state.folder}
                    toggleShareModal={() => this.toggleModal('share')}
                    toggleEditModal={() => this.toggleModal('edit')}
                    toggleDeleteModal={() => this.toggleModal('delete')}
                    user={this.props.user}
                />

                <LinkList links={this.state.folder.links}
                    addBookmarkCallback={(bookmark) => this.addBookmark(bookmark)}
                    deleteBookmarkCallback={(bookmarkId) => this.deleteBookmark(bookmarkId)}
                    toggleDeleteModal={() => this.toggleModal('deleteLink')}
                    toggleModal={() => this.toggleModal('')}
                    modal={this.state.modal}
                />

                <ShareFolderModal
                    open={this.state.modal === 'share'}
                    messages={this.state.messages}
                    toggleCallback={() => this.toggleModal('share')}
                    togglePublicCallback={() => this.togglePublic()}
                    inviteUserCallback={(e, m) => this.shareFolder(e, m)}
                    folder={this.state.folder}
                    folderID={this.state.folderID}
                    error={this.state.shareError}
                />

                <DeleteModal
                    open={this.state.modal === 'delete'}
                    toggleCallback={() => this.toggleModal('delete')}
                    deleteCallback={() => this.deleteFolder()}
                    type='folder'
                    name={this.state.folder.name}
                />

                <EditFolderModal
                    open={this.state.modal === 'edit'}
                    toggleCallback={() => this.toggleModal('edit')}
                    editCallback={(newText) => this.editName(newText)}
                    folderName={this.state.folder.name}
                />
            </div>);
        } else {
            return <Alert color='warning'>You do not have permission to view this folder! You may need to <Link to='/login'>log in</Link>.</Alert>
        }

        return content;
    }
}
