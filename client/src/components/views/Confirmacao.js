import React from 'react';
import { Spinner } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import api from '../../config/axios/api.js';

class Confirmacao extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingRequest: true,
      message: '',
    };
  }

  componentDidMount() {
    let queryParams = {}; 
    new URLSearchParams(this.props.location.search).forEach((value, key) => {
      queryParams[key] = value;
    });
    api.post('/confirmation', {
      ...queryParams,
      confirmed: true,
    }).then(response => {
      if (response.status === 200) {
        this.setState({
          isLoadingRequest: false,
          message: 'Usuário ativado com sucesso!'
        });
      } else {
        this.setState({
          isLoadingRequest: false,
          message: 'Erro na ativação do usuário. Tente novamente!'
        });
      }
    });
  }

  render() {
    if (this.state.isLoadingRequest) {
      return (
        <div className='d-flex flex-column align-items-center
          justify-content-center h-100'
        >
          <Spinner animation='border' size='lg' role='status'
            style={ { height: '5em', width: '5em' } }
          ></Spinner>
          <p className='mt-3'>Aguardando resposta...</p>
        </div>
      );
    } else {
      return (
        <div className='h3 d-flex align-items-center justify-content-center
          h-100'
        >
          {this.state.message}
        </div>
      );
    }
  }
}

export default withRouter(Confirmacao);
