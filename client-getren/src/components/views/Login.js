import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

import { login } from '../../storage/user/userSlice.js';
import api from '../../config/axios/api.js';

class Login extends React.Component {
  constructor(props) {
    super(props);

    if (props.user.data) {
      props.history.push('/');
    }

    this.state = {
      error: null
    }
  }

  render() {
    let errorSection = '';
    if (this.state.error) {
      errorSection = <ul><li>{this.state.error}</li></ul>;
    }

    return (
      <div>
        Página de login
        <form onSubmit={this.handleSubmit} method='post'>
          <input type='text' name='email' placeholder='E-mail' />
          { errorSection }
          <br/>
          <input type='text' name='password' placeholder='Senha' />
          <br/>
          <button>Entrar</button>
        </form>
      </div>
    );
  }

  handleSubmit = (event) => {
    event.preventDefault();

    api.post('login', {
      email: event.target.email.value,
      password: event.target.password.value,
    }).then(response => {
      if (response.data.status === 200) {
        this.props.dispatch(
          login({
            email: response.data.user.email,
            id: response.data.user.id,
          })
        );

        this.props.history.push('/');
      } else if (response.data.status === 400) {
        this.setState({ error: response.data.error });
      }
    });
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Login));
