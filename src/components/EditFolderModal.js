import React, { Component } from 'react';
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// Modal that allows the user to edit a folder name
export default class EditFolderModal extends Component {
    constructor(props) {
        super(props);
        this.state = ({ value: this.props.folderName });
    }

    // Update state to reflect text box
    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    // Edit the message
    handleEdit(event) {
        event.preventDefault();
        this.props.editCallback(this.state.value);
        this.props.toggleCallback();
    }

    render() {
        return (
            <Modal isOpen={this.props.open} toggle={this.props.toggleCallback}>
                <ModalHeader toggle={this.props.toggleCallback}>
                    Rename folder
                </ModalHeader>

                <ModalBody>
                    <Input type='text' name='folderName' id='folderName' value={this.state.value}
                        onChange={(e) => this.handleChange(e)}
                    />
                </ModalBody>
                
                <ModalFooter>
                    <Button color="secondary" onClick={this.props.toggleCallback}>Cancel</Button>
                    <Button color="primary" onClick={(event) => this.handleEdit(event)}
                        disabled={this.state.value.length === 0}
                    >
                        <i className='fa fa-pencil' aria-hidden='true'></i> Confirm
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}