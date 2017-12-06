import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input, Label, Form, FormGroup, FormFeedback, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// Modal that allows the user to share a folder with other users
export default class ShareFolderModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: undefined
        };
    }

    render() {
        return (
            <Modal isOpen={this.props.open} toggle={this.props.toggleCallback}>
                <ModalHeader toggle={this.props.toggleCallback}>
                    Share folder
                </ModalHeader>
                <ModalBody>
                    wow
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={this.props.toggleCallback}>Done</Button>
                </ModalFooter>
            </Modal>
        );
    }
}