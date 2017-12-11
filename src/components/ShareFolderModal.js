import React, { Component } from 'react';
import { Table, Alert, Input, Label, Form, FormGroup, InputGroup, InputGroupButton, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import firebase from 'firebase/app';

// Modal that allows the user to share a folder with other users
export default class ShareFolderModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            dropdownOpen: false,
            shareMode: 'view',

            userList: {},
            listUpdated: false
        };
    }

    componentDidMount() {
        this.updateUsers(this.props.folder.users);
    }

    componentWillReceiveProps(nextProps) {
        this.updateUsers(nextProps.folder.users);
    }

    // Update the list of users that has access to this folder
    updateUsers(users) {
        this.setState({ userList: {} });
        if (users) {
            Object.keys(users).forEach((id) => {
                firebase.database().ref('userPermissions/' + id + '/userName').once('value')
                    .then((snapshot) => {
                        let displayName = snapshot.val();
                        let newUsers = Object.assign(this.state.userList, { [id]: { name: displayName, perm: users[id] } });
                        this.setState({ userList: newUsers });
                    });
            });
        }
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
        this.setState({ shareMode: type });
    }

    // Share the folder
    shareFolder(event) {
        event.preventDefault();
        this.props.inviteUserCallback(this.state.email, this.state.shareMode);
    }

    render() {
        let isPublic = this.props.folder.public;

        // Build list of users to display
        let users = [];
        if (this.state.userList) {
            let userIDs = Object.keys(this.state.userList)
            users = userIDs.map((id) => {
                let user = this.state.userList[id];
                let permDisplay = (<span>
                    <i className={'fa fa-' + (user.perm === 'edit' ? 'pencil' : 'eye')} aria-hidden='true'></i>{' '}
                    Can <strong>{user.perm}</strong>
                </span>)
                return (<tr key={id}>
                    <td>
                        {user.name}
                    </td>
                    <td>
                        {permDisplay}
                    </td>
                    <td>
                        <Button size='sm' color='link' title='Remove user'
                            onClick={() => this.props.removeUserCallback(id)}>
                            <i className="fa fa-remove" aria-label='Remove user'></i>
                        </Button>
                    </td>
                </tr>);
            });
        }

        return (
            <Modal isOpen={this.props.open} toggle={this.props.toggleCallback} >
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
                            <Input type="text" name='link' id='link' value={window.location.href} readOnly
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
                                    value={this.props.email}
                                    onChange={(e) => this.handleChange(e)}
                                />
                                <InputGroupButton>
                                    <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={() => this.toggleDropdown()}>
                                        <DropdownToggle caret color='secondary'>
                                            <i className={'fa fa-' + (this.state.shareMode === 'edit' ? 'pencil' : 'eye')} aria-hidden='true'></i>{' '}
                                            Can <strong>{this.state.shareMode}</strong>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={() => this.setShareMode('view')}>
                                                <i className='fa fa-eye' aria-hidden='true'></i>{' '}
                                                Can <strong>view</strong>
                                            </DropdownItem>
                                            <DropdownItem onClick={() => this.setShareMode('edit')}>
                                                <i className='fa fa-pencil' aria-hidden='true'></i>{' '}
                                                Can <strong>edit</strong>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                </InputGroupButton>
                                <InputGroupButton>
                                    <Button color="primary" title='Invite user' onClick={(e) => this.shareFolder(e)}
                                        disabled={this.state.email.length === 0}>
                                        <i className='fa fa-user-plus' aria-label='Invite user'></i>
                                    </Button>
                                </InputGroupButton>
                            </InputGroup>

                            {this.props.error && <Alert color='warning'>{this.props.error}</Alert>}
                        </FormGroup>
                    </Form>

                    {users.length !== 0 && <div>
                        <h4>Current users</h4>
                        <Table hover responsive>
                            <tbody>
                                {users}
                            </tbody>
                        </Table>
                    </div>}

                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={this.props.toggleCallback}>Done</Button>
                </ModalFooter>
            </Modal>
        );
    }
}