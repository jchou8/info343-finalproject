import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

// Page that allows the user to login
export default class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: undefined,
      password: undefined
    };
  }

  // Update state to reflect input
  handleChange(event) {
    let newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  // Log the user in
  handleLogin(event) {
    event.preventDefault();
    this.props.loginCallback(this.state.email, this.state.password);
  }

  render() {
    if (this.props.user) {
      // Redirect the user if they're already logged in
      return <Redirect to='/' />;
    } else {
      return (
        <div>
          <h2>Login</h2>

          <div className='text-left'>
            <Form>
              <FormGroup>
                <Label for='email'>Email</Label>
                <Input type='email' name='email' id='email' placeholder='example@example.com'
                  onChange={(e) => this.handleChange(e)}
                />
              </FormGroup>

              <FormGroup>
                <Label for='password'>Password</Label>
                <Input type='password' name='password' id='password'
                  onChange={(e) => this.handleChange(e)}
                />
              </FormGroup>

              <Button color='primary' size='lg' onClick={(event) => this.handleLogin(event)}>
                <i className='fa fa-sign-in' aria-hidden='true'></i> Login
              </Button>
            </Form>

            <p className='register-info'>Don't have an account yet?</p>
            <Link to='/register'>
              <Button color='primary' size='lg'>
                <i className='fa fa-user-plus' aria-hidden='true'></i> Register
              </Button>
            </Link>
          </div>
        </div >
      );
    }
  }
}