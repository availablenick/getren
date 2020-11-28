import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { login } from '../../storage/user/userSlice';
import api from '../../config/axios/api.js';

class Cadastro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      requestSent: false,
      userRegistered: false,
      isPasswordVisible: false,
      isPasswordConfirmationVisible: false,
    }
  }

  render() {
    let errorSection = {};
    for (let error of Object.keys(this.state.errors)) {
      if (this.state.errors[error].length <= 0) {
        errorSection[error] = '';
      } else {
        errorSection[error] = 
          <ul className='mt-1'>
            {this.state.errors[error].map((message, i) => {
              return <li key={i}>{message}</li>;
            })}
          </ul>
      }
    }

    const errorInputStyle = { boxShadow: '0 0 0 2px red' };

    let content = '';
    if (!this.state.userRegistered) {
      content = 
        <div className='d-flex justify-content-center align-items-center
          flex-column h-100'
        >
          <h2>GETREN</h2>
          <form className='form-login' style={{width: '30em'}} onSubmit={this.handleSubmit} method='post'>
            <div>
              <label>E-mail</label>
              <input type='text' name='email'
                style={
                  Object.keys(this.state.errors).length > 0 &&
                  this.state.errors.email.length > 0 ?
                  errorInputStyle
                  :
                  {}
                }
                onChange={ () => { this.setState({ errors: {} }) } }
              />
              { errorSection['email'] }
            </div>
            <div>
              <label>Senha</label>
              <div className='position-relative d-flex align-items-center'>
                <input type={ this.state.isPasswordVisible ? 'text' : 'password'}
                  className='w-100' name='password'
                  style={
                    Object.keys(this.state.errors).length > 0 &&
                    this.state.errors.password.length > 0 ?
                    errorInputStyle
                    :
                    {}
                  }
                  onChange={ () => { this.setState({ errors: {} }) } }
                />
                <button className='password-visibility' type='button'
                  onClick={ () => { this.setState(prevState => ({isPasswordVisible: !prevState.isPasswordVisible})) } }
                >
                  { this.state.isPasswordVisible ?
                    <FontAwesomeIcon icon='eye-slash' fixedWidth />
                    : 
                    <FontAwesomeIcon icon='eye' fixedWidth />
                  }
                </button>
              </div>
              { errorSection['password'] }
            </div>
            <div>
              <label>Confirme a senha</label>
              <div className='position-relative d-flex align-items-center'>
                <input type={ this.state.isPasswordConfirmationVisible ? 'text' : 'password'} 
                  className='w-100' name='password_confirm'
                  style={
                    Object.keys(this.state.errors).length > 0 &&
                    this.state.errors.password_confirm.length > 0 ?
                    errorInputStyle
                    :
                    {}
                  }
                  onChange={ () => { this.setState({ errors: {} }) } }
                />
                <button className='password-visibility' type='button'
                  onClick={ () => { this.setState(prevState => ({isPasswordConfirmationVisible: !prevState.isPasswordConfirmationVisible})) } }                >
                  { this.state.isPasswordConfirmationVisible ? 
                    <FontAwesomeIcon icon='eye-slash' fixedWidth
                    />
                    : 
                    <FontAwesomeIcon icon='eye' fixedWidth
                    />
                  }
                </button>
              </div>
              { errorSection['password_confirm'] }
            </div>
            <div className='d-flex justify-content-center mt-4'>
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
      if (response.status === 200) {
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
      }
    }).then(response => {
      // response.status === 200
      if (response) {
        setTimeout(() => {
          this.props.history.push('/');
        }, 5000);
      }
    }).catch(error => {
      if (!error.response) {
        setTimeout(() => {
          this.props.history.push('/');
        }, 5000);
      } else if (error.response.status === 400) {
        this.setState({ 
          errors: error.response.data.errors,
          requestSent: false
        });
      }
    });
  }

  handleClick = () => {
    api.post('confirmation', {
      email: this.props.user.data.email,
      confirmed: false
    });
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Cadastro));
