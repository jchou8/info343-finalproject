import React, { Component } from 'react';
import { Button } from 'reactstrap';

export default class FolderHeader extends Component {
    render() {
        let folder = this.props.folder;
        let isOwner = this.props.user && (folder.ownerID === this.props.user.uid);

        return (
            <div className='folder-header'>
                <h2 className='folder-title text-left'>
                    {folder.name}
                </h2>

                {isOwner && <div className='header-buttons text-right'>
                    <Button color='primary' outline title='Share folder' 
                        onClick={this.props.toggleShareModal}>
                        <i className='fa fa-link' aria-label='Share folder'></i>
                        </Button>
                    {' '}
                    <Button color='secondary' outline title='Rename folder'
                        onClick={this.props.toggleEditModal}
                    ><i className='fa fa-pencil' aria-label='Rename folder'></i></Button>
                    {' '}
                    <Button color='danger' outline title='Delete folder' onClick={this.props.toggleDeleteModal}>
                    <i className='fa fa-trash' aria-label='Delete folder'></i></Button>
                </div>
                }
            </div>
        );
    }
}