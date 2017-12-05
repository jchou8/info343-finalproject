import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, Input } from 'reactstrap';

import './styles/Navigation.css';

// Pop-out sidebar menu, with header, current user, and folder list
export default class Navigation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      createActive: false
    }
  }



  // testing for clicking the create folder button
  // trying to make it toggle the section for creating folder
  toggleCreateFolder() {
    this.setState({createActive: !this.state.createActive});
    console.log('create folder status:'+this.state.createActive);
  }


  closeCreateFolder() {
    this.setState({
      createActive: false
    });
  }

  createFolder() {
    return false;
  }


  
  render() {
    let user = this.props.user;
    let active = this.props.active ? 'active' : '';
    let chevDir = this.props.active ? 'left' : 'right';

    // a dummy div that will show up based on createActive
    let addFeature = (<div active={this.state.createActive}>input blah</div>)

    // Changes the display of create folder
    let createFolder = "";
    if(!this.state.createActive) {
      createFolder = (<div className='sidebar-link' onClick={() => this.toggleCreateFolder()}><i className='fa fa-plus' aria-hidden='true'></i> Create Folder</div>) ;
    } else {
      createFolder = (
      <div className='sidebar-link'>
        <div onClick={() => this.closeCreateFolder()}><i className='fa fa-minus' aria-hidden='true'></i> Cancel</div>
        <img className="img-fluid" src="https://cdn0.iconfinder.com/data/icons/iconico-3/1024/63.png" alt="folder image"/>
        <div>Folder name: <Input /></div>
        {/* <div onClick={() => this.createFolder()}><i className='fa fa-plus' aria-hidden='true'></i> Add Folder</div> */}
        <Button color="primary" onClick={() => this.createFolder()}><i className='fa fa-plus' aria-hidden='true'></i> Add Folder</Button>
      </div>
    ) ;
    }

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

              <div>
                <h2>Folders</h2>
                <ul className='list-unstyled'>
                  <li className='sidebar-folder'>
                    {createFolder}
                  </li>
                </ul>
              </div>

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