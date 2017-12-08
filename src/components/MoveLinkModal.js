import React, { Component } from 'react';
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// Modal that allows the user to move a bookmark to a different folder
export default class MoveLinkModal extends Component {
    render() {
        return (
            <Modal isOpen={this.props.open} toggle={this.props.toggleCallback}>
                <ModalHeader toggle={this.props.toggleCallback}>
                    Rename folder
                </ModalHeader>

                <ModalBody>
                </ModalBody>

                <ModalFooter>
                    <Button color="secondary" onClick={this.props.toggleCallback}>Cancel</Button>
                    <Button color="primary" onClick={(event) => this.handleMove(event)}>
                        <i className='fa fa-folder-open' aria-hidden='true'></i> Move
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}