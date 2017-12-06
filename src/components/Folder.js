import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
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
            loading: true
        };
    }

    componentDidMount() {
        this.linksRef = firebase.database().ref('folders/' + this.props.match.params.folderID);
        this.linksRef.on('value', (snapshot) => {
            this.setState({ folder: snapshot.val(), loading: false });
        });
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

    render() {
        let content = null;
        if (this.state.loading) {
            content = <Spinner name='circle' color='steelblue' fadeIn='none' aria-label='Loading...' />;
        } else {
            content = (<div>
                <FolderHeader folder={this.state.folder}
                    toggleShareModal={() => this.toggleShareModal()}
                    toggleEditModal={() => this.toggleEditModal()}
                    toggleDeleteModal={() => this.toggleDeleteModal()}
                />

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
                {this.props.user &&
                    content
                }
            </div>
        );
    }
}