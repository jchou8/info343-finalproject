import React, { Component } from 'react';
import { Button } from 'reactstrap';

// Header bar for a folder, displaying folder info and buttons to modify the folder
export default class FolderHeader extends Component {
    render() {
        let folder = this.props.folder;
        let isOwner = this.props.user && (folder.ownerID === this.props.user.uid);

        let numLinks = folder.links ? Object.keys(folder.links).length : 0;
        let displayLinks = numLinks + ' link';
        if (numLinks !== 1) {
            displayLinks += 's';
        }

        return (
            <div className='folder-header'>
                <h2 className='folder-title'>
                    {folder.name}
                </h2>

                <div className='text-muted folder-subtitle'>{displayLinks}</div>
                
                {isOwner && <div className='header-buttons'>
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