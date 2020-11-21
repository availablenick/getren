import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { login } from '../../storage/user/userSlice.js';
import api from '../../config/axios/api.js';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.passwordRef = React.createRef();
    this.passwordConfirmationRef = React.createRef();

    if (props.user.data) {
      props.history.push('/');
    }

    this.state = {
      error: null,
      isPasswordVisible: false,
      isPasswordConfirmationVisible: false,
      isModalVisible: false
    }
  }

  render() {
    let errorSection = '';
    if (this.state.error) {
      errorSection = <ul className='mt-1'><li>{ this.state.error }</li></ul>;
    }
    
    const errorInputStyle = { boxShadow: '0 0 0 2px red' };

    return (
      <div className='d-flex justify-content-center align-items-center
        flex-column h-100'
      >
        <h2>LOGIN</h2>
        <form className='form-login' onSubmit={ this.handleSubmit } method='post'>
          <div>
            <label>E-mail</label>
            <input type='text' name='email'
              style={
                this.state.error ?
                errorInputStyle
                :
                {}
              }
              onChange={ () => { this.setState({ error: null }) } }
            />

            { errorSection }
          </div>
          <div>
            <label>Senha</label>
            <div className='position-relative d-flex align-items-center'>
              <input type={ this.state.isPasswordVisible ? 'text' : 'password'}
                className='w-100' name='password'
                onChange={ () => { this.setState({ error: null }) } }
              />
              <button className='password-visibility' type='button'
                ref={this.passwordRef} onClick={this.handlePasswordClick}
              >
                { this.state.isPasswordVisible ?
                  <FontAwesomeIcon icon='eye-slash' fixedWidth />
                  : 
                  <FontAwesomeIcon icon='eye' fixedWidth />
                }
              </button>
            </div>
          </div>
          <div>
            <button type='button' id='forgot-password'
              onClick={this.handleModalVisibilityChange}
            >
              Esqueci minha senha
            </button>
            <button className='btn btn-primary'>Entrar</button>
          </div>
        </form>

        <div class='mt-5'>
          Não é registrado ainda? <Link to='/cadastro'>Cadastre-se</Link>
        </div>

        <div className='modal-backdrop' tabIndex='-1' role='dialog'
          style={
            this.state.isModalVisible ?
            { display: 'block' }
            :
            { display: 'none' }
          }
        >
          <div className='modal-dialog modal-dialog-centered' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Trocar a senha</h5>
                <button type='button' className='close' aria-label='Close'
                  onClick={this.handleModalVisibilityChange}
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <p>
                  Identifique-se para receber um e-mail com as instruções e o
                  link para criar uma nova senha.
                </p>

                <form>
                  <div className='d-flex flex-column'>
                    <label>E-mail:</label>
                    <input type='text' name='recovery-email' />
                  </div>
                </form>
              </div>
              <div className='modal-footer'>
                <button type='button' className='btn btn-secondary'
                  onClick={this.handleModalVisibilityChange}
                >
                  Cancelar
                </button>
                <button type='button' className='btn btn-primary'>Enviar senha</button>
              </div>
            </div>
          </div>
        </div>
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

  handleModalVisibilityChange = () => {
    this.setState(prevState => {
      return { isModalVisible: !prevState.isModalVisible }
    });
  }

  handlePasswordClick = (event) => {
    event.stopPropagation();

    if (event.target === this.passwordRef.current ||
      this.passwordRef.current.contains(event.target)) {

      this.setState(prevState => {
        return { isPasswordVisible: !prevState.isPasswordVisible }
      });
    } else if (event.target === this.passwordConfirmationRef.current ||
      this.passwordConfirmationRef.current.contains(event.target)) {

      this.setState(prevState => {
        return { isPasswordConfirmationVisible: !prevState.isPasswordConfirmationVisible }
      });  
    }
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Login));
