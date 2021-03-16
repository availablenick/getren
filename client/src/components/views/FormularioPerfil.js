import React from 'react';

import { Toast } from 'react-bootstrap';
import axios from 'axios';
import api from '../../config/axios/api.js';

class FormularioPerfil extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        name: props.user.name ? props.user.name : '',
        email: props.user.email ? props.user.email : '',
        job: props.user.job ? props.user.job : '',
        birthdate: props.user.birthdate ? props.user.birthdate : new Date().toISOString().slice(0, 10),
        federalState: props.user.federal_state ? props.user.federal_state : '',
        city: props.user.city ? props.user.city : '',        
      },
      federalStatesOptionsList: [],
      citiesOptionsList: [],
      didUpdateSucceed: false,
    }
  }

  componentDidMount = () => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
          let federalStatesOptionsList = response.data.map((state, index) => {
            return (
              <option value={state.sigla} key={index}>
                {state.sigla}
              </option>
            );
          });
          this.setState({
            federalStatesOptionsList: federalStatesOptionsList
          });
          return this.requestCitiesList(this.props.user.federal_state);
      })
      .then(response => {
        this.setState({ citiesOptionsList: response });
      })
      .catch(() => {});
    }

  render() {
    return (
      <>
        <h2 className='border-bottom w-100 text-center pb-3'>PERFIL</h2>
        <form className='form-login w-75 p-5' onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor='name'>Nome</label>
            <input type='text' id='name' name='name'
              defaultValue={this.state.user.name}
            />
          </div>

          <div>
            <label htmlFor='email'>E-mail</label>
            <input type='text' id='email' name='email' disabled
              defaultValue={this.state.user.email}
            />
          </div>

          <div>
            <label htmlFor='job'>Profissão</label>
            <input className='w-100' type='text' id='job' name='job'
              defaultValue={this.state.user.job}
            />
          </div>

          <div>
            <label htmlFor='birthdate'>Data de nascimento</label>
            <input type='date' id='birthdate' name='birthdate'
              defaultValue={this.state.user.birthdate}
            />
          </div>

          <div>
            <label htmlFor='federal_state'>Estado</label>
            <select id='federal_state' name='federal_state'
              value={this.state.user.federalState}
              onChange={this.handleChangeStates}
            >
              {this.state.federalStatesOptionsList}
            </select>
          </div>

          <div>
            <label htmlFor='city'>Cidade</label>
            <select id='city' name='city' value={this.state.user.city}
            onChange={this.handleChangeCities}>
              {this.state.citiesOptionsList}
            </select>
          </div>

          <div className='d-flex justify-content-center'>
            <button type='submit' className='btn btn-primary'>Atualizar</button>
          </div>
        </form>
        
        <Toast className='position-fixed'
          style={{ bottom: '1em', right: '1em', width: '30em' ,zIndex: '10' }}
          onClose={ () => { this.setState({ didUpdateSucceed: false }) } }
          show={ this.state.didUpdateSucceed } delay={ 3000 } autohide
        >
          <Toast.Header>
            <strong className="mr-auto">Perfil atualizado!</strong>
            <small>Há poucos segundos</small>
          </Toast.Header>
          <Toast.Body>Seus dados foram atualizados!</Toast.Body>
        </Toast>
      </>
    )
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let formData = new FormData(event.target);
    let requestData = {};
    for (let [key, value] of formData.entries()) {
      requestData[key] = value;
    }

    api.put('/users/' + this.props.user.id, requestData)
      .then(response => {
        if (response.status === 200) {
          this.setState({
            user: response.data,
            didUpdateSucceed: true,
            message: 'Perfil atualizado com sucesso!'
          });
        }
      });
  }

  handleChangeStates = (event) => {
    event.persist();
    this.setState(prevState => ({
      user: {
        ...prevState.user,
        federalState: event.target.value
      }
    }));
    this.requestCitiesList(event.target.value)
      .then(response => {
        this.setState({
          citiesOptionsList: response
        });
      });
  }

  handleChangeCities = (event) => {
    event.persist();
    this.setState(prevState => ({
      user: {
        ...prevState.user,
        city: event.target.value
      }
    }));
  }

  requestCitiesList = (federalState) => {
    if (!this.state.federalStatesOptionsList[0]) {
      return new Promise((_, reject) => { reject('Estados não carregados'); });
    }

    let citiesOptionsList = [];
    let federalStateParam = this.state.federalStatesOptionsList[0].props.value;
    if (federalState) {
      federalStateParam = federalState;
    }
    let url = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + 
      federalStateParam + '/municipios';
    return new Promise(resolve => {
      axios.get(url)
        .then(response => {
          citiesOptionsList = response.data.map((city, index) => {
            return (
              <option value={city.nome} key={index}>
                  {city.nome}
              </option>
            );
          });
          resolve(citiesOptionsList);
        });
    });
  }
}

export default FormularioPerfil;