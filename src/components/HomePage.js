import React, { Component } from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, Button, Row, Col, Alert } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';

import './styles/HomePage.css';

// Main page that shows up when first logging into the app
export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            folders: [],
            sharedFolders: []
        };
    }

    componentDidMount() {
        this.createCards(this.props.folders);
    }

    componentWillReceiveProps(nextProps) {
        this.createCards(nextProps.folders);
    }

    // Create the list of cards to render
    createCards(folders) {
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

            // Sort into different categories if it's a shared folder
            if (isOwner) {
                folderList.push(folderObj);
            } else {
                sharedFolderList.push(folderObj);
            }
        });

        this.setState({folderList: folderList, sharedFolderList: sharedFolderList})
    }

    render() {
        let content = null;
        let folderList = this.state.folderList;
        let shared = this.state.sharedFolderList;

        if (this.props.user) {
            content = (
                <div>
                    <h2>Welcome, {this.props.user.displayName}!</h2>

                    <div className='folder-card-group'>
                        <h3>Your folders</h3>

                        {folderList && folderList.length > 0 &&
                            <Row>
                                {folderList}
                            </Row>
                        }

                        {folderList && folderList.length === 0 &&
                            <Alert color='warning' aria-live='polite'>You have not made any folders yet!</Alert>
                        }
                    </div>

                    {shared && shared.length > 0 &&
                        <div className='folder-card-group'>
                            <h3>Folders shared with you</h3>
                            <Row>
                                {shared}
                            </Row>
                        </div>
                    }
                </div>
            );
        } else {
            content = <Redirect to='/login' />;
        }

        return content;
    }
}