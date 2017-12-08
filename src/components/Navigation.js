import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import './styles/Navigation.css';

import FolderList from './FolderList';

// Pop-out sidebar menu, with header, current user, and folder list
export default class Navigation extends Component {
  render() {
    let user = this.props.user;
    let active = this.props.active ? 'active' : '';
    let chevDir = this.props.active ? 'left' : 'right';

    return (
      <div id='sidebar' className={active}>
        <Button id='sidebar-collapse' className='float-left' outline={!this.props.active} color='primary'
          onClick={this.props.toggleCallback}>
          <i className={'fa fa-chevron-' + chevDir} aria-label={this.props.active ? 'Collapse navbar' : 'Expand navbar'}></i>
        </Button>

        <Link to='/' className='header-link'>
          <header className='page-header'>
            <h1 className='app-title'>
              bookmarker
            </h1>
          </header>
        </Link>

        <nav>
          {user &&
            <div>
              <div className='sidebar-user'>
                <img src={user.photoURL} alt='User avatar' className='sidebar-avatar float-left' />
                <div className='sidebar-username'>
                  {user.displayName}
                </div>
              </div>

              <FolderList
                closeCallback={this.props.closeCallback}
                user={this.props.user}
                folders={this.props.folders}
                createFolderCallback={this.props.createFolderCallback}
              />

              <Link to='/login'>
                <Button color='secondary' onClick={this.props.signOutCallback}>
                  <i className='fa fa-sign-out' aria-hidden='true'></i> log out
                </Button>
              </Link>
            </div>
          }

          {!user &&
            <div>
              <Link to='/login' className='sidebar-login'>Sign in</Link> to see your bookmarks!
            </div>
          }
        </nav>
      </div>
    );
  }
}
