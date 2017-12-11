import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Alert } from 'reactstrap';
import Spinner from 'react-spinkit';

import firebase from 'firebase/app';

import FolderHeader from './FolderHeader';
import LinkList from './LinkList';
import ShareFolderModal from './ShareFolderModal';
import DeleteModal from './DeleteModal';
import EditFolderModal from './EditFolderModal';
import EditLinkModal from './EditLinkModal';
import MoveLinkModal from './MoveLinkModal';

import './styles/Folder.css';

// Displays a folder, which includes a header and list of links
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

        if (this.props.user) {
            firebase.database().ref('userPermissions/' + this.props.user.uid + '/permissions/' + folderID).once('value')
                .then((snapshot) => {
                    let perm = snapshot.val();
                    this.setState({ perm: perm });
                });
        }
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

    // Toggle the modal with the given name
    toggleModal(modal) {
        let newModal = this.state.modal === modal ? '' : modal;
        this.setState({ modal: newModal });
    }

    // Delete a folder
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

    // Toggle whether the folder is public via link
    togglePublic() {
        this.linksRef.update({
            public: !this.state.folder.public
        });
    }

    // Edit the folder name
    editName(newName) {
        // Don't do anything if name didn't actually change
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

    // Share a folder to user with the given email
    shareFolder(email, mode) {
        this.setState({ shareError: '' });
        
        // Grab user ID from email
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

    // Unshare a folder with the user with the given ID
    unshareFolder(uid) {
        this.linksRef.child('/users/' + uid).remove();
        firebase.database().ref('userPermissions/' + uid + '/permissions/' + this.state.folderID).remove();
    }

    // Add a bookmark to the folder
    addBookmark(bookmark) {
        this.linksRef.child('/links').push(bookmark);
    }

    // Open a modal to modify the given bookmark
    confirmModifyBookmark(bookmark, action) {
        this.setState({ bookmarkToModify: bookmark }, () => this.toggleModal(action + 'Link'));
    }

    // Delete a bookmark given its id
    deleteBookmark(bookmarkId) {
        firebase.database().ref('folders/' + this.state.folderID + '/links/' + bookmarkId).remove();
        this.setState({ bookmarkToModify: null });
    }

    // Edit a bookmark with a new name and url
    editBookmark(newName, newURL, bookmarkId) {
        firebase.database().ref('folders/' + this.state.folderID + '/links/' + bookmarkId).set(
            Object.assign(this.state.bookmarkToModify, { Name: newName, URL: newURL })
        );
        this.setState({ bookmarkToModify: null });
    }

    // Move a bookmark to a different folder
    moveBookmark(newFolderID, bookmarkId) {
        firebase.database().ref('folders/' + this.state.folderID + '/links/' + bookmarkId).remove();
        firebase.database().ref('folders/' + newFolderID + '/links').push(this.state.bookmarkToModify);
        this.setState({ bookmarkToModify: null });
    }


    render() {
        let canAccess = this.props.user && (this.state.perm === 'owner' || this.state.perm === 'edit' || this.state.perm === 'view');
        let content = null;
        if (this.state.loading) {
            content = <Spinner name='circle' color='steelblue' fadeIn='none' aria-label='Loading...' />;
        } else if (!this.state.folder) {
            content = <Redirect to='/' />;
        } else if (canAccess || (this.state.folder && this.state.folder.public)) {
            content = (<div>
                <FolderHeader folder={this.state.folder}
                    toggleShareModal={() => this.toggleModal('share')}
                    toggleEditModal={() => this.toggleModal('edit')}
                    toggleDeleteModal={() => this.toggleModal('delete')}
                    user={this.props.user}
                />

                <LinkList links={this.state.folder.links}
                    addBookmarkCallback={(bookmark) => this.addBookmark(bookmark)}
                    deleteBookmarkCallback={(bookmark) => this.confirmModifyBookmark(bookmark, 'delete')}
                    editBookmarkCallback={(bookmark) => this.confirmModifyBookmark(bookmark, 'edit')}
                    moveBookmarkCallback={(bookmark) => this.confirmModifyBookmark(bookmark, 'move')}
                    toggleDeleteModal={() => this.toggleModal('deleteLink')}
                    modal={this.state.modal}
                    permission={this.state.perm}
                />

                <ShareFolderModal
                    open={this.state.modal === 'share'}
                    messages={this.state.messages}
                    toggleCallback={() => this.toggleModal('share')}
                    togglePublicCallback={() => this.togglePublic()}
                    inviteUserCallback={(e, m) => this.shareFolder(e, m)}
                    removeUserCallback={(id) => this.unshareFolder(id)}
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

                {this.state.bookmarkToModify &&
                    <DeleteModal
                        open={this.state.modal === 'deleteLink'}
                        toggleCallback={() => this.toggleModal('deleteLink')}
                        deleteCallback={() => this.deleteBookmark(this.state.bookmarkToModify.id)}
                        type='link'
                        name={this.state.bookmarkToModify.Name}
                    />}

                {this.state.bookmarkToModify &&
                    <EditLinkModal
                        open={this.state.modal === 'editLink'}
                        toggleCallback={() => this.toggleModal('editLink')}
                        editCallback={(name, url) => this.editBookmark(name, url, this.state.bookmarkToModify.id)}
                        bookmark={this.state.bookmarkToModify}
                    />}

                {this.state.bookmarkToModify &&
                    <MoveLinkModal
                        open={this.state.modal === 'moveLink'}
                        toggleCallback={() => this.toggleModal('moveLink')}
                        moveCallback={(id) => this.moveBookmark(id, this.state.bookmarkToModify.id)}
                        bookmark={this.state.bookmarkToModify}
                        curFolderID={this.state.folderID}
                        folders={this.props.folders}
                        folderPerms={this.props.folderPerms}
                    />}
            </div>);
        } else {
            return <Alert color='warning'>You do not have permission to view this folder! You may need to <Link to='/login'>log in</Link>.</Alert>
        }

        return content;
    }
}
