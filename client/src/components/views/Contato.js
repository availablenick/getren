import React from 'react';
import { connect } from 'react-redux';
import { Toast } from 'react-bootstrap';

import api from '../../config/axios/api.js';

class Contato extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contact: {
        name: '',
        email: '',
        subject: '',
        message: '',
      },
      messageSent: false,
    }
  }

  componentDidMount() {
    if (this.props.user && this.props.user.data) {
      let name = this.props.user.data.name || '';
      let email = this.props.user.data.email || '';

      this.setState(prevState => {
        return {
          contact: {
            ...prevState.contact,
            name: name,
            email: email
          }
        }
      });
    }
  }
  
  render() {
    return (
      <>
        <div className='d-flex justify-content-center align-items-center
        flex-column h-100'
        >
          <form className='form-login' style={{width: '30em'}} onSubmit={this.handleSubmit} method='post'>
            <div>
              <label htmlFor='name'>Nome</label>
              <input className='w-100' type='text' id='name' name='name' 
                  onChange={this.handleInputChange}
                  value={this.state.contact.name}
              />
            </div>

            <div>
              <label htmlFor='email'>E-mail</label>
              <input className='w-100' type='text' id='email' name='email' 
                onChange={this.handleInputChange}
                value={this.state.contact.email}
              />
            </div>

            <div>
              <label htmlFor='subject'>Assunto</label>
              <input className='w-100' type='text' id='subject' name='subject' 
                onChange={this.handleInputChange}
                value={this.state.contact.subject}
              />
            </div>

            <div>
                <label htmlFor='message'>Mensagem</label>
                <textarea className='w-100' type='text' id='message' name='message' 
                  onChange={this.handleInputChange}
                  value={this.state.contact.message}
                />
            </div>

            <div className='d-flex justify-content-center'>
              <button className='btn btn-primary'>Enviar mensagem</button>
            </div>
          </form>

          <Toast className='position-fixed'
            style={{ bottom: '1em', right: '1em', width: '30em' ,zIndex: '10' }}
            onClose={ () => { this.setState({ messageSent: false }) } }
            show={ this.state.messageSent } delay={ 3000 } autohide
          >
            <Toast.Header>
              <strong className="mr-auto">Mensagem enviada!</strong>
              <small>Há poucos segundos</small>
            </Toast.Header>
            <Toast.Body>Sua mensagem foi enviada! Não esqueça de checar sua caixa de mensagens.</Toast.Body>
          </Toast>
        </div>
      </>
    );
  }

  handleSubmit = (event) => {
    event.preventDefault();
    
    api.post('/contact', this.state.contact)
      .then((response) => {
        this.setState({ messageSent: true });
        this.setState(prevState => {
          return { 
            contact: {
              ...prevState.contact,
              subject: '',
              message: '',
            }
          }
        });
      });
  }

  handleInputChange = (event) => {
    event.persist();

    let field = event.target.name;
    let value = event.target.value;
    this.setState(prevState => {
      return {
        contact: {
          ...prevState.contact,
          [field]: value
        }
      }
    });
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default connect(mapStateToProps)(Contato);
