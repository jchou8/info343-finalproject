import React, { Component } from 'react';
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label } from 'reactstrap';

// Modal that allows the user to edit a bookmark
export default class EditLinkModal extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            name: this.props.bookmark.Name,
            url: this.props.bookmark.URL
        });
    }

    // Update initial params when link changes
    componentWillReceiveProps(nextProps) {
        this.setState({ name: nextProps.bookmark.Name, url: nextProps.bookmark.URL });
    }

    // Update state to reflect text box
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
    
    // Edit the link
    handleEdit(event) {
        event.preventDefault();
        this.props.editCallback(this.state.name, this.state.url);
        this.props.toggleCallback();
    }

    render() {
        return (
            <Modal isOpen={this.props.open} toggle={this.props.toggleCallback}>
                <ModalHeader toggle={this.props.toggleCallback}>
                    Edit bookmark
                </ModalHeader>

                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for='name'>Name</Label>
                            <Input type='text' name='name' id='name' value={this.state.name}
                                onChange={(e) => this.handleChange(e)}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for='name'>URL</Label>
                            <Input type='text' name='url' id='url' value={this.state.url}
                                onChange={(e) => this.handleChange(e)}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>

                <ModalFooter>
                    <Button color="secondary" onClick={this.props.toggleCallback}>Cancel</Button>
                    <Button color="primary" onClick={(event) => this.handleEdit(event)}
                        disabled={this.state.name.length === 0 || this.state.url.length === 0}
                    >
                        <i className='fa fa-pencil' aria-hidden='true'></i> Confirm
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}