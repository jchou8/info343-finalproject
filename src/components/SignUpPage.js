import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';

// Page that allows the user to create an account
export default class SignUpPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: undefined,
      username: undefined,
      password: undefined,
      passwordConfirm: undefined
    };
  }

  // Update state to reflect input
  handleChange(event) {
    let newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  // Register the user
  handleRegister(event) {
    event.preventDefault();
    this.props.registerCallback(this.state.email, this.state.username, this.state.password);
  }

  // Determine whether email is valid
  validateEmail(email) {
    if (email !== undefined) {
      let valid = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
      if (!valid) {
        return 'Not a valid email address.';
      }
    }
    return undefined;
  }

  // Determine whether username is valid
  validateUsername(username) {
    if (username !== undefined) {
      if (username.length > 30) {
        return 'Display name must be less than 30 characters long.';
      }
    }
    return undefined;
  }

  // Determine whether password is valid
  validatePassword(password) {
    if (password !== undefined) {
      if (password.length < 6) {
        return 'Password must be at least 6 characters long.';
      }
    }
    return undefined;
  }

  // Determine whether passwords match
  confirmPassword(password, passwordConfirm) {
    if (passwordConfirm !== undefined) {
      if (passwordConfirm !== password) {
        return 'Passwords do not match.';
      }
    }
    return undefined;
  }

  render() {
    if (this.props.user) {
      // If the user is already logged in, redirect them
      return <Redirect to='/' />;
    } else {
      // Validate each form
      let emailError = this.validateEmail(this.state.email);
      let nameError = this.validateUsername(this.state.username);
      let pwError = this.validatePassword(this.state.password);
      let pwMismatch = this.confirmPassword(this.state.password, this.state.passwordConfirm);

      let emailValid = this.state.email ? emailError === undefined : undefined;
      let nameValid = this.state.username ? nameError === undefined : undefined;
      let pwValid = this.state.password ? pwError === undefined : undefined;
      let pwConfValid = this.state.passwordConfirm ? pwMismatch === undefined : undefined;

      // Only enable signup if all four inputs are valid
      let enableSignup = emailValid && nameValid && pwValid && pwConfValid;

      return (
        <div>
          <div className='text-left'>
            <Link to='/login'>
              <Button color='secondary'>
                <i className='fa fa-arrow-circle-left' aria-hidden='true'></i> Back to login
              </Button>
            </Link>
          </div>

          <h2>Register</h2>

          <div className='text-left'>
            <Form>
              <FormGroup>
                <Label for='email'>Email</Label>
                <Input type='email' name='email' id='email' placeholder='example@example.com'
                  valid={emailValid}
                  onChange={(e) => this.handleChange(e)}
                />
                {emailError !== undefined && <FormFeedback>{emailError}</FormFeedback>}
              </FormGroup>

              <FormGroup>
                <Label for='username'>Display Name</Label>
                <Input type='text' name='username' id='username' placeholder='cooldude222'
                  valid={nameValid}
                  onChange={(e) => this.handleChange(e)}
                />
                {nameError !== undefined && <FormFeedback>{nameError}</FormFeedback>}
              </FormGroup>

              <FormGroup>
                <Label for='password'>Password</Label>
                <Input type='password' name='password' id='password'
                  onChange={(e) => this.handleChange(e)}
                  valid={pwValid}
                />
                {pwError !== undefined && <FormFeedback>{pwError}</FormFeedback>}
              </FormGroup>

              <FormGroup>
                <Label for='passwordConfirm'>Confirm Password</Label>
                <Input type='password' name='passwordConfirm' id='passwordConfirm'
                  onChange={(e) => this.handleChange(e)}
                  valid={pwConfValid}
                />
                {pwMismatch !== undefined && <FormFeedback>{pwMismatch}</FormFeedback>}
              </FormGroup>

              <Button color='primary' size='lg'
                onClick={(event) => this.handleRegister(event)}
                disabled={!enableSignup}>
                <i className='fa fa-user-plus' aria-hidden='true'></i> Register
              </Button>
            </Form>
          </div>
        </div>
      );
    }
  }
}