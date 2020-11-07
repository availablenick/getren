import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import { login } from '../../storage/user/userSlice';

class Cadastro extends React.Component {
  constructor(props) {
    super(props);

    if (props.user.data) {
      props.history.push('/');
    }

    this.state = {
      errors: {}
    }
  }

  render() {
    let error_section = {};
    for (let error of Object.keys(this.state.errors)) {
      if (this.state.errors[error].length <= 0) {
        error_section[error] = '';
      } else {
        error_section[error] = 
          <ul>
            {this.state.errors[error].map((message, i) => {
              return <li key={i}>{message}</li>;
            })}
          </ul>
      }
    }

    return (
      <div>
        Página de cadastro
        <form onSubmit={this.handleSubmit} method='post'>
          <input type='text' name='email' placeholder='E-mail' />
          <br/>
          { error_section['email'] }
          <input type='text' name='password' placeholder='Senha' />
          <br/>
          { error_section['password'] }
          <input type='text' name='password_confirm' placeholder='Confirmar senha' />
          <br/>
          { error_section['password_confirm'] }
          <button>Cadastrar</button>
        </form>
      </div>
    );
  }

  handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://0.0.0.0:5000/register', {
      email: event.target.email.value,
      password: event.target.password.value,
      password_confirm: event.target.password_confirm.value,
    }).then(response => {
      if (response.data.status === 200) {
        this.props.dispatch(
          login({
            email: response.data.user.email,
            password: response.data.user.password,
          })
        );

        this.props.history.push('/');
      } else if (response.data.status === 400) {
        this.setState({ errors: response.data.errors });
      }
    });
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Cadastro));
