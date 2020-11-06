import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import { login } from '../../storage/user/userSlice.js';
import history from '../../config/router/history.js';

class Login extends React.Component {
  constructor(props) {
    super(props);

    if (props.user.data) {
      history.push('/');
    }

    this.state = {
      error: null
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://0.0.0.0:5000/login', {
      email: event.target.email.value,
      password: event.target.password.value,
    }).then(response => {
      if (response.data.status === 200) {
        this.props.dispatch(
          login({
            email: response.data.user.email,
            password: response.data.user.password,
          })
        );

        history.push('/');
      } else if (response.data.status === 400) {
        this.setState({ error: response.data.error });
      }
    });
  }

  render() {
    let error_section = '';
    if (this.state.error) {
      error_section = <ul><li>{this.state.error}</li></ul>;
    }

    return (
      <div>
        Página de login
        <form onSubmit={this.handleSubmit} method='post'>
          <input type='text' name='email' placeholder='E-mail' />
          { error_section }
          <br/>
          <input type='text' name='password' placeholder='Senha' />
          <br/>
          <button>Entrar</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default connect(mapStateToProps)(Login);
