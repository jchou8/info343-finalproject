import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Input, Label, Form, FormGroup, InputGroup, InputGroupButton, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// Modal that allows the user to share a folder with other users
export default class ShareFolderModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            dropdownOpen: false,
            shareMode: 'view'
        };
    }

    // Toggle dropdown
    toggleDropdown() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    // Update state to reflect input
    handleChange(event) {
        let newState = {};
        newState[event.target.name] = event.target.value;
        this.setState(newState);
    }

    // Set sharing mode
    setShareMode(type) {
        this.setState({shareMode: type});
    }

    // Share the folder
    shareFolder(event) {
        event.preventDefault();
        this.props.inviteUserCallback(this.state.email, this.state.shareMode);
    }

    render() {
        let isPublic = this.props.folder.public;

        let users = this.props.folder.users;

        return (
            <Modal isOpen={this.props.open} toggle={this.props.toggleCallback}>
                <ModalHeader toggle={this.props.toggleCallback}>
                    Share folder
                </ModalHeader>
                <ModalBody>
                    <h3>Link sharing</h3>
                    <Button color={isPublic ? 'danger' : 'success'} onClick={this.props.togglePublicCallback}>
                        <i className='fa fa-link' aria-hidden='true'></i>
                        {isPublic ? ' Disable public link' : ' Enable public link'}
                    </Button>

                    {isPublic ?
                        <div>
                            <Label for='link'>Anyone with this link can view this folder:</Label>
                            <Input type="text" name='link' id='link' value={process.env.PUBLIC_URL + '/#/bookmarks/' + this.props.folderID} readOnly
                                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
                        </div>

                        :

                        <div>
                            This folder can only be accessed by selected users.
                        </div>
                    }
                    <br />
                    <h3>Invite users</h3>
                    <Form>
                        <FormGroup>
                            <Label for='email'>Invite user by email</Label>

                            <InputGroup>
                                <Input type='email' name='email' id='email' placeholder='example@example.com'
                                    onChange={(e) => this.handleChange(e)}
                                />
                                <InputGroupButton>
                                    <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={() => this.toggleDropdown()}>
                                        <DropdownToggle caret color='secondary'>
                                            Can <strong>{this.state.shareMode}</strong>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={() => this.setShareMode('view')}>Can <strong>view</strong></DropdownItem>
                                            <DropdownItem onClick={() => this.setShareMode('edit')}>Can <strong>edit</strong></DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                </InputGroupButton>
                                <InputGroupButton>
                                    <Button color="primary" title='Invite user' onClick={(e) => this.shareFolder(e)}>
                                        <i className='fa fa-user-plus' aria-label='Invite user'></i>
                                    </Button>
                                </InputGroupButton>
                            </InputGroup>

                            {this.props.error && <Alert color='warning'>{this.props.error}</Alert>}
                        </FormGroup>
                    </Form>

                    <h4>Current users</h4>

                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={this.props.toggleCallback}>Done</Button>
                </ModalFooter>
            </Modal>
        );
    }
}