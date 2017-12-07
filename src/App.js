import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
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
      navActive: false
    };
  }

  componentDidMount() {
    // Update state when user logs in/out
    this.authUnRegFunc = firebase.auth().onAuthStateChanged((user) => {
      this.setState({ loading: false, error: null });
      if (user) {
        this.setState({ user: user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  componentWillUnmount() {
    this.authUnRegFunc();
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

  render() {
    // Functions for router to render components and pass in necessary props
    let renderFolder = (props) => <Folder {...props}
      user={this.state.user}
    />;
    let renderHomePage = (props) => <HomePage {...props}
      user={this.state.user}
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
      <HashRouter>
        <div className='app'>
          <div className='wrapper'>
            <Navigation
              user={this.state.user}
              signOutCallback={() => this.handleSignOut()}
              toggleCallback={() => this.toggleNavbar()}
              closeCallback={() => this.closeNavbar()}
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
      </HashRouter>
    );
  }
}

export default App;
