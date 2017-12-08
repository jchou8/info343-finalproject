import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input, Label, Form, FormGroup, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// Modal that allows the user to share a folder with other users
export default class ShareFolderModal extends Component {
    render() {
        let isPublic = this.props.folder.public;

        return (
            <Modal isOpen={this.props.open} toggle={this.props.toggleCallback}>
                <ModalHeader toggle={this.props.toggleCallback}>
                    Share folder
                </ModalHeader>
                <ModalBody>
                    <h2>Link sharing</h2>
                    <Button color={isPublic ? 'danger' : 'success'} onClick={this.props.togglePublicCallback}>
                        <i className='fa fa-link' aria-hidden='true'></i>
                        {isPublic ? ' Disable public link' : ' Enable public link'}
                    </Button>

                    {isPublic ?
                        <div>
                            <Label for='link'>Anyone with this link can view this folder:</Label>
                            <Input type="text" name='link' id='link' value={'%PUBLIC_URL%/#/bookmarks/' + this.props.folderID} readOnly
                                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
                        </div>

                        :

                        <div>
                            This folder can only be accessed by selected users.
                        </div>
                    }
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={this.props.toggleCallback}>Done</Button>
                </ModalFooter>
            </Modal>
        );
    }
}