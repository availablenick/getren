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
      errors: {},
      requestSent: false,
      userRegistered: false
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

    let content = '';
    if (!this.state.userRegistered) {
      content = 
        <div>
          <h2>Página de Cadastro</h2>
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
          {
            this.state.requestSent &&
              <span>
                Cadastrando...
              </span>
          }
        </div>
    } else {
      content = 
        <div>
          <span>
            Usuário cadastrado. 
            Um email foi enviado para 
            {this.props.user.data.email} para confirmar seu cadastro.
            Clique no botão para reenviar o email.
          </span>
          <button onClick={this.handleClick}>Reenviar email</button>
        </div>
    }

    return content;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    
    if (this.state.userRegistered) {
      return;
    }
    
    this.setState({ requestSent: true });

    axios.post('http://localhost:5000/register', {
      email: event.target.email.value,
      password: event.target.password.value,
      password_confirm: event.target.password_confirm.value,
    }).then(response => {
      if (response.data.status === 200) {
        this.props.dispatch(
          login({
            email: response.data.user.email,
            id: response.data.user.id,
          })
        );
        this.setState({ userRegistered: true });
        return axios.post('http://localhost:5000/confirmation', {
          email: response.data.user.email,
          confirmed: false
        });
      } else if (response.data.status === 400) {
        this.setState({ 
          errors: response.data.errors,
          requestSent: false 
        });
      }
    }).then(response => {
      if (response && response.data.status === 200) {
        setTimeout(() => {
          this.props.history.push('/');
        }, 15000);
      }
    });
  }

  handleClick = (event) => {
    axios.post('http://localhost:5000/confirmation', {
      email: this.props.user.data.email,
      confirmed: false
    });
  }

}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Cadastro));
