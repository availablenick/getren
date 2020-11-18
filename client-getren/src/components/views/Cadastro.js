import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { login } from '../../storage/user/userSlice';
import api from '../../config/axios/api.js';

class Cadastro extends React.Component {
  constructor(props) {
    super(props);

    if (props.user.data) {
      props.history.push('/');
    }

    this.state = {
      errors: {},
      requestSent: false,
      userRegistered: false,
      isPasswordVisible: false,
      isPasswordConfirmationVisible: false
    }
  }

  render() {
    let errorSection = {};
    for (let error of Object.keys(this.state.errors)) {
      if (this.state.errors[error].length <= 0) {
        errorSection[error] = '';
      } else {
        errorSection[error] = 
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
        <div className='d-flex justify-content-center align-items-center
          flex-column h-100'
        >
          <h2>GETREN</h2>
          <form className='form-login' onSubmit={this.handleSubmit} method='post'>
            <div>
              <label>E-mail</label>
              <input type='text' name='email' />
              { errorSection['email'] }
            </div>
            <div>
              <label>Senha</label>
              <div className='position-relative d-flex align-items-center'>
                <input type={ this.state.isPasswordVisible ? 'text' : 'password'} className='w-100' name='password' />                
                { this.state.isPasswordVisible ? 
                  <FontAwesomeIcon icon='eye-slash' className='password-visibility' 
                    onClick={this.handlePasswordClick} data-name='fa-password'
                  />
                  : 
                  <FontAwesomeIcon icon='eye' className='password-visibility' 
                    onClick={this.handlePasswordClick} data-name='fa-password'
                  />
                }
              </div>
              { errorSection['password'] }
            </div>
            <div>
              <label>Confirme a senha</label>
              <div className='position-relative d-flex align-items-center'>
                <input type={ this.state.isPasswordConfirmationVisible ? 'text' : 'password'} 
                  className='w-100' name='password_confirm' 
                />
                { this.state.isPasswordConfirmationVisible ? 
                  <FontAwesomeIcon icon='eye-slash' className='password-visibility' 
                    onClick={this.handlePasswordClick} data-name='fa-password-confirmation'
                  />
                  : 
                  <FontAwesomeIcon icon='eye' className='password-visibility' 
                    onClick={this.handlePasswordClick} data-name='fa-password-confirmation'
                  />
                }
              </div>
              { errorSection['password_confirm'] }
            </div>
            <div>
              <button type='button' id='forgot-password'>Esqueci minha senha</button>
              <button className='btn btn-primary'>Cadastrar</button>
            </div>
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
            Um email foi enviado para {this.props.user.data.email} para confirmar
            seu cadastro.
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

    api.post('register', {
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
        return api.post('confirmation', {
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

  handleClick = () => {
    api.post('confirmation', {
      email: this.props.user.data.email,
      confirmed: false
    });
  }

  handlePasswordClick = (event) => {
    event.stopPropagation();

    console.log(event.target.getAttribute('data-name'))

    if (event.target.getAttribute('data-name') === 'fa-password') {
      this.setState(prevState => {
        return { isPasswordVisible: !prevState.isPasswordVisible }
      });

    } else if (event.target.getAttribute('data-name') === 'fa-password-confirmation') {
      this.setState(prevState => {
        return { isPasswordConfirmationVisible: !prevState.isPasswordConfirmationVisible }
      });
    }
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Cadastro));
