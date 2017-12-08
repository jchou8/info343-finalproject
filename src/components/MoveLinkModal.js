import React, { Component } from 'react';
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label } from 'reactstrap';

// Modal that allows the user to move a bookmark to a different folder
export default class MoveLinkModal extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            folder: this.props.curFolderID,
            folderList: []
        });
    }

    buildLinkList(folders, perms) {
        let folderList = [];
        if (folders && perms) {
            Object.keys(folders).forEach((id) => {
                let folder = folders[id];
                let perm = perms[id];
                if (perm === 'edit' || perm === 'owner') {
                    folderList.push({ id: id, name: folder.name });
                }
            });
        }

        this.setState({ folderList: folderList });
    }

    componentDidMount() {
        this.buildLinkList(this.props.folders, this.props.folderPerms);
    }

    componentWillReceiveProps(nextProps) {
        this.buildLinkList(nextProps.folders, nextProps.folderPerms);
        this.setState({ folder: nextProps.curFolderID });
    }

    // Update state to reflect text box
    handleChange(event) {
        this.setState({ folder: event.target.value });
    }

    // Edit the link
    handleMove(event) {
        event.preventDefault();
        this.props.moveCallback(this.state.folder);
        this.props.toggleCallback();
    }

    render() {
        let options = [];
        if (this.state.folderList) {
            console.log(this.state.folderList);
            options = this.state.folderList.map((folder) => {
                return (<option key={folder.id} value={folder.id}>
                    {folder.name}
                </option>);
            })
        }

        return (
            <Modal isOpen={this.props.open} toggle={this.props.toggleCallback}>
                <ModalHeader toggle={this.props.toggleCallback}>
                    Where do you want to move the link <strong>{this.props.bookmark.Name}</strong>?
                </ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <Label for="folder">Select folder</Label>
                        <Input type="select" name="folder" id="folder" defaultValue={this.state.folder} onChange={(e) => this.handleChange(e)}>
                            {options}
                        </Input>
                    </FormGroup>
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