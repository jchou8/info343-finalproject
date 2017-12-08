import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import md5 from 'md5';

import { Alert } from 'reactstrap';
import Spinner from 'react-spinkit';

import Navigation from './components/Navigation';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import HomePage from './components/HomePage';
import Folder from './components/Folder.js';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      navActive: false,
      folders: {},
      permissions: {}
    };
  }

  filterFoldersByPermissions() {
    let folders = this.state.folders;
    let perms = this.state.permissions;
    let filteredFolders = {};
    if (perms && folders) {
      let folderKeys = Object.keys(folders);

      folderKeys.forEach((key) => {
        let perm = perms[key];
        if (perm) {
          if (perm === 'owner' || perm === 'view' || perm === 'edit') {
            filteredFolders = Object.assign(filteredFolders, { [key]: folders[key] });
          }
        }
      });
    }

    this.setState({ folders: filteredFolders, loading: false });
  }

  componentDidMount() {
    // Update state when user logs in/out
    this.authUnRegFunc = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user, loading: false });

        // Get user permissions
        this.permsRef = firebase.database().ref('userPermissions/' + user.uid + '/permissions');
        this.permsRef.on('value', (snapshot) => {
          this.setState({ permissions: snapshot.val() }, () => this.filterFoldersByPermissions());
        });

        // Get list of folders from db
        this.foldersRef = firebase.database().ref('folders');
        this.foldersRef.on('value', (snapshot) => {
          this.setState({ folders: snapshot.val() }, () => this.filterFoldersByPermissions());
        });

      } else {
        this.setState({ user: null, folders: null, permissions: null, loading: false });
      }
    });
  }

  componentWillUnmount() {
    this.authUnRegFunc();
    this.foldersRef.off();
    this.permsRef.off();
  }

  // Toggle the sidebar
  toggleNavbar() {
    this.setState({
      navActive: !this.state.navActive
    });
  }

  // Close the sidebar
  closeNavbar() {
    this.setState({
      navActive: false
    });
  }

  // Sign in with an email and password
  handleSignIn(email, password) {
    this.setState({ loading: true, error: null });

    return firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((error) => {
        console.log(error);
        this.setState({ error: error.message });
      })
      .then(() => {
        this.setState({ loading: false });
      });
  }

  // Register with an email, display name, and password
  handleRegister(email, username, password) {
    this.setState({ loading: true, error: null });

    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        firebase.database().ref('emailToUID/' + email.replace('.', ',')).set(user.uid);
        return user.updateProfile({
          displayName: username,
          photoURL: 'https://www.gravatar.com/avatar/' + md5(email) // Grab Gravatar
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: error.message });
      })
      .then(() => {
        let userObj = {
          userName: this.state.user.displayName
        }
        firebase.database().ref('userPermissions/' + this.state.user.uid).set(userObj);
        this.setState({ loading: false });
      });

  }

  // Sign out
  handleSignOut() {
    this.setState({ loading: true, error: null });

    return firebase.auth().signOut()
      .catch((error) => {
        console.log(error);
        this.setState({ error: error.message });
      })
      .then(() => {
        this.setState({ loading: false });
      });
  }

  //
  createFolder(folder) {
    let key = this.foldersRef.push(folder).key;
    this.props.history.push('/bookmarks/' + key);
    firebase.database().ref('userPermissions/' + this.state.user.uid + '/permissions/' + key).set('owner');
  }

  render() {
    // Functions for router to render components and pass in necessary props
    let renderFolder = (props) => <Folder {...props}
      user={this.state.user}
      folders={this.state.folders}
    />;
    let renderHomePage = (props) => <HomePage {...props}
      user={this.state.user}
      folders={this.state.folders}
      createFolderCallback={(folder) => this.createFolder(folder)}
    />;
    let renderLogin = (props) => <LoginPage {...props}
      loginCallback={(email, pw) => this.handleSignIn(email, pw)}
      user={this.state.user}
    />;
    let renderRegister = (props) => <SignUpPage {...props}
      registerCallback={(email, name, pw) => this.handleRegister(email, name, pw)}
      user={this.state.user}
    />;

    return (
      <div className='app'>
        <div className='wrapper'>
          <Navigation
            user={this.state.user}
            folders={this.state.folders}
            signOutCallback={() => this.handleSignOut()}
            toggleCallback={() => this.toggleNavbar()}
            closeCallback={() => this.closeNavbar()}
            createFolderCallback={(folder) => this.createFolder(folder)}
            active={this.state.navActive}
          />

          <div className='container main-content'>
            <main>
              {this.state.error && <Alert color='danger' aria-live='polite'>{this.state.error}</Alert>}
              {this.state.loading && <Spinner name='circle' color='steelblue' fadeIn='none' aria-label='Loading...' />}
              <Switch>
                <Route exact path='/' render={renderHomePage} />
                <Route path='/register' render={renderRegister} />
                <Route path='/login' render={renderLogin} />
                <Route path='/bookmarks/:folderID' render={renderFolder} />
              </Switch>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
