import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// Modal that confirms deletion of a folder or bookmark
export default class DeleteModal extends Component {
    render() {
        return (
            <Modal isOpen={this.props.open} toggle={this.props.toggleCallback}>
                <ModalHeader toggle={this.props.toggleCallback}>
                    Are you sure you want to delete this {this.props.type}?
                </ModalHeader>
                {this.props.whatToRender &&
                    <ModalBody>
                        {this.props.whatToRender}
                    </ModalBody>
                }
                <ModalFooter>
                    <Button color="secondary" onClick={this.props.toggleCallback}>Cancel</Button>
                    <Button color="danger" onClick={this.props.deleteCallback}>
                        <i className='fa fa-trash' aria-hidden='true'></i> Delete
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}