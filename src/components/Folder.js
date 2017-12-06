import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import FolderHeader from './FolderHeader';
import LinkList from './LinkList';

export default class Folder extends Component {
    render() {
        return (
            <div>
                <FolderHeader/>
                <LinkList/>
            </div>
        );
    }
}