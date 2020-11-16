import React from 'react';
import { Link, withRouter } from 'react-router-dom';

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
    api.post('confirmation', {
      ...queryParams,
      confirmed: true,
    }).then(response => {
      if (response.data.status === 200) {
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
    let message = <h2>Aguarde...</h2>;
    if (!this.state.isLoadingRequest) {
      message = <h2>{this.state.message}</h2>;
    }
    
    return (
      <div>
        { message }
        <br/>
        <Link to='/'>Home</Link>
      </div>
    );
  }
}

export default withRouter(Confirmacao);
