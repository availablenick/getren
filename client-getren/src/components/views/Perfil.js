import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import axios from 'axios';
import api from '../../config/axios/api.js';

class Perfil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      federalStatesOptionsList: [],
      citiesOptionsList: [],
      errors: {},
      didUpdateSucceed: false
    };
  }
  
  componentDidMount = () => {
    let url = 'user/' + this.props.user.data.id;
    api.get(url)
      .then(response => {
        if (response.status === 200) {
          this.setState({
            user: response.data
          });
        }

        return axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
      })
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
          return this.requestCitiesList(this.state.user.federal_state);
      })
      .then(response => {
        this.setState({ citiesOptionsList: response });
      });
  }

  render() {
    return (
      <div className='d-flex justify-content-center align-items-center
        flex-column h-100'
      >
        <h2>PERFIL</h2>
        <form className='form-login' style={{width: '30em'}} onSubmit={this.handleSubmit} method='post'>
          <div>
            <label htmlFor='name'>Nome</label>
            <input type='text' id='name' name='name'
              defaultValue={this.state.user.name !== null ? this.state.user.name : ''}
            />
          </div>

          <div>
            <label htmlFor='email'>E-mail</label>
            <input type='text' id='email' name='email' disabled
              defaultValue={this.state.user.email !== null ? this.state.user.email : ''}
            />
          </div>

          <div>
            <label htmlFor='job'>Profissão</label>
            <input className='w-100' type='text' id='job' name='job'
              defaultValue={this.state.user.job !== null ? this.state.user.job : ''}
            />
          </div>

          <div>
            <label htmlFor='birthdate'>Data de nascimento</label>
            <input type='date' id='birthdate' name='birthdate'
              defaultValue={
                this.state.user.birthdate !== null ?
                this.state.user.birthdate
                :
                ''
              }
            />
          </div>

          <div>
            <label htmlFor='federal_state'>Estado</label>
            <select id='federal_state' name='federal_state'
              value={this.state.user.federal_state}
              onChange={this.handleChangeStates}
            >
              {this.state.federalStatesOptionsList}
            </select>
          </div>

          <div>
            <label htmlFor='city'>Cidade</label>
            <select id='city' name='city' value={this.state.user.city}>
              {this.state.citiesOptionsList}
            </select>
          </div>

          <div className='d-flex justify-content-center'>
            <button className='btn btn-primary'>Atualizar</button>
          </div>
        </form>

        {this.state.didUpdateSucceed &&
          <span>Perfil atualizado com sucesso</span>
        }
      </div>
    );
  }

  handleChangeStates = (event) => {
    event.persist();
    this.setState(prevState => ({
      user: {
        ...prevState.user,
        federal_state: event.target.value
      }
    }));
    this.requestCitiesList(event.target.value)
      .then(response => {
        this.setState({
          citiesOptionsList: response
        });
      });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let formData = new FormData(event.target);
    let requestData = {};
    for (let [key, value] of formData.entries()) {
      requestData[key] = value;
    }

    api.put('user/' + this.props.user.data.id, requestData)
      .then(response => {
        if (response.status === 200) {
          this.setState({
            user: response.data,
            didUpdateSucceed: true
          });
        }
      });
  }

  requestCitiesList = (federalState) => {
    let citiesOptionsList = [];
    let federalStateParam = this.state.federalStatesOptionsList[0].props.value;
    if (federalState !== null) {
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

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Perfil));