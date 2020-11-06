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
      }
    });
  }

  render() {
    return (
      <div>
        Página de login
        <form onSubmit={this.handleSubmit} method='post'>
          <input type='text' name='email' placeholder='E-mail' />
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
