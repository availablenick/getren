import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal } from 'react-bootstrap';

import { login } from '../../storage/user/userSlice.js';
import api from '../../config/axios/api.js';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isModalVisible: false,
      isPasswordConfirmationVisible: false,
      isPasswordVisible: false
    }
  }

  render() {
    let errorSection = '';
    if (this.state.error) {
      errorSection = <ul className='mt-1'><li>{this.state.error}</li></ul>;
    }

    const errorInputStyle = { boxShadow: '0 0 0 2px red' };

    return (
      <div className='d-flex justify-content-center align-items-center
        flex-column h-100'
      >
        <h2>LOGIN</h2>
        <form className='form-login' style={{width: '30em'}}
          onSubmit={this.handleSubmit} method='post'
        >
          <div>
            <label>E-mail</label>
            <input type='text' name='email'
              style={
                this.state.error ?
                  errorInputStyle
                  :
                  {}
              }
              onChange={() => { this.setState({ error: null }) }}
            />

            {errorSection}
          </div>
          <div>
            <label>Senha</label>
            <div className='position-relative d-flex align-items-center'>
              <input className='w-100 password'
                type={this.state.isPasswordVisible ? 'text' : 'password'}
                name='password' 
                onChange={() => { this.setState({ error: null }) }}
              />
              <button className='password-visibility' type='button' tabIndex='-1'
                onClick={() => {
                  this.setState(prevState => ({
                    isPasswordVisible: !prevState.isPasswordVisible
                  }))
                }}
              >
                {this.state.isPasswordVisible ?
                  <FontAwesomeIcon icon='eye-slash' fixedWidth />
                  :
                  <FontAwesomeIcon icon='eye' fixedWidth />
                }
              </button>
            </div>
          </div>
          <div>
            <button className='p-0' type='button' id='forgot-password'
              onClick={() => { this.setState({ isModalVisible: true }) }}
            >
              Esqueci minha senha
            </button>
            <button type='submit' className='btn btn-primary'>Entrar</button>
          </div>
        </form>

        <div className='mt-5'>
          Não é registrado ainda? <Link to='/cadastro'>Cadastre-se</Link>
        </div>

        <Modal
          show={this.state.isModalVisible}
          onHide={() => { this.setState({ isModalVisible: false }) }}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header>
            <Modal.Title>Trocar a senha</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Identifique-se para receber um e-mail com as instruções e o
              link para criar uma nova senha.
            </p>
            <form className='form-login'>
              <div className='d-flex flex-column'>
                <label>E-mail:</label>
                <input type='text' name='recovery-email' />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary"
              onClick={() => { this.setState({ isModalVisible: false }) }}
            >
              Cancelar  
            </Button>
            <Button variant="primary">Enviar senha</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  handleSubmit = (event) => {
    event.preventDefault();
    api.post('login', {
      email: event.target.email.value,
      password: event.target.password.value,
    }).then(response => {
      if (response.status === 200) {
        this.props.dispatch(
          login({
            email: response.data.email,
            id: response.data.id,
          })
        );
      }
    }).catch(error => {
      if (error.response.status === 400) {
        this.setState({ error: error.response.data.error });
      }
    });
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Login));
