import React, { Component } from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, Button, Row, Col, Alert } from 'reactstrap';
import { Link } from 'react-router-dom';

import './styles/HomePage.css';

export default class HomePage extends Component {
    render() {
        let folders = this.props.folders;
        let folderIDs = [];
        if (folders) {
            folderIDs = Object.keys(folders);
        }

        // Build list of cards for folders
        let folderList = [];
        let sharedFolderList = [];

        // Create a card for each folder
        folderIDs.forEach((id) => {
            let folder = folders[id];
            let isOwner = this.props.user.uid === folder.ownerID;
            let numLinks = folder.links ? Object.keys(folder.links).length : 0;
            let displayLinks = numLinks + ' link';
            if (numLinks !== 1) {
                displayLinks += 's';
            }

            let folderObj = (
                <Col key={id} xs='12' md='6' lg='4'>
                    <Card className='folder-card'>
                        <CardBody>
                            <CardTitle><i className='fa fa-folder' aria-hidden='true'></i> {folder.name}</CardTitle>
                            {!isOwner && <CardSubtitle>Owned by {folder.owner}</CardSubtitle>}

                            <div>
                                {displayLinks}
                            </div>

                            <Link className='folder-card-button' to={'/bookmarks/' + id}>
                                <Button color='primary'>
                                    <i className='fa fa-chevron-circle-right' aria-hidden='true'></i> Open
                                </Button>
                            </Link>
                        </CardBody>
                    </Card>
                </Col>
            );

            if (isOwner) {
                folderList.push(folderObj);
            } else {
                sharedFolderList.push(folderObj);
            }
        });

        let content = null;
        if (this.props.user) {
            content = (
                <div>
                    <h2>Welcome, {this.props.user.displayName}!</h2>

                    <div className='folder-card-group'>
                        <h3>Your folders</h3>

                        {folderList.length > 0 &&
                            <Row>
                                {folderList}
                            </Row>
                        }

                        {folderList.length === 0 &&
                            <Alert color='warning' aria-live='polite'>You have not made any folders yet!</Alert>
                        }
                    </div>

                    {sharedFolderList.length > 0 &&
                        <div className='folder-card-group'>
                            <h3>Folders shared with you</h3>
                            <Row>
                                {sharedFolderList}
                            </Row>
                        </div>
                    }
                </div>
            );
        }

        return content;
    }
}