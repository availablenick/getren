import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Spinner } from 'react-bootstrap';

import axios from 'axios';
import api from '../../config/axios/api.js';
import './Perfil.scss';
import logo from '../../images/getren-logo-large.png';

class Perfil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      federalStatesOptionsList: [],
      citiesOptionsList: [],
      errors: {},
      didUpdateSucceed: false,
      selectedTab: 'minhasCompras',
      isLoading: true,
      courses: []
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
    let content = null;
    if (this.state.selectedTab === 'perfil') {
      content = 
        <>
          <h2 className='border-bottom w-100 text-center pb-3'>PERFIL</h2>
          <form className='form-login w-100 p-5' onSubmit={ this.handleSubmit } method='post'>
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
            MINHAS COMPRAS
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
        </>;
    } else if (this.state.selectedTab === 'minhasCompras') {
      new Promise(() => {
        setTimeout(() => { 
          let courses = [];
          for (let i = 0; i < 10; i++) {
            courses[i] = {
              id: i,
              name: 'Rei dos cursos ' + i,
              number_of_videos: 100,
              duration: '4 anos',
              image: logo
            };
          }
          this.setState({ courses: courses, isLoading: false });
        }, 1000);
      });
      content =
        <>
          <h2 className='border-bottom w-100 text-center pb-3'>MINHAS COMPRAS</h2>
          { this.state.isLoading && 
            <div className='d-flex flex-column justify-content-center align-items-center h-100' >
              <Spinner animation='border' size='lg' role='status'
                style={ { height: '3em', width: '3em' } }
              >
                <span className='sr-only'>Carregando cursos...</span>
              </Spinner>
              <span className='mt-2'>Carregando cursos...</span>
            </div> 
          }
          { !this.state.isLoading &&
            <ul className='mt-5 pl-5 w-100 '>
              { this.state.courses.map((course, index) => {
                  return (
                    <li key={ index } className='d-flex justify-content-center border-bottom mb-3 pb-3'
                      style={ { listStyleType: 'none' } }
                    >
                      <a className='no-decoration horizontal-card-link w-100' href='#'>
                        <div className='d-flex'>
                          <div className='bg-white'>
                            <img src={ logo } style={{ width: '15em' }}/>
                          </div>
                          <div className='px-3'>
                            <b>
                              { course.name }
                            </b>
                          </div>
                        </div>
                      </a>
                    </li>
                  )
                })
              }
            </ul>
          }
        </>;
    }

    return (
      <div className='d-flex justify-content-center
        h-100 w-100'
      >
        <div className='row w-50 m-0 p-0'>
          <div className='d-flex justify-content-center
            col-3 border-right px-0'
          >
            <ul className='sidebar w-100 px-0' style={{ marginTop: '15em' }}>
              <li>
                <button name='perfil' 
                  disabled={ this.state.selectedTab === 'perfil' ? true : false }
                  onClick={ this.handleSidebarClick }
                >
                  Perfil
                </button>
              </li>
              <li>
                <button name='minhas-compras' 
                  disabled={ this.state.selectedTab === 'minhasCompras' ? true : false }
                  onClick={ this.handleSidebarClick }
                >
                  Minhas Compras
                </button>
              </li>
              <li>
                <button name='sair' onClick={ this.handleSidebarClick }>
                  Sair
                </button>
              </li>
            </ul>
          </div>
          <div className='d-flex align-items-center flex-column col-9 px-0'>
            { content }
            
          </div>
        </div>
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

  handleSidebarClick = (event) => {
    if (event.target.name === 'perfil') {
      this.setState({ selectedTab: 'perfil' });
    } else if (event.target.name === 'minhas-compras') {
      this.setState({ selectedTab: 'minhasCompras' });
    } else {
      
    }
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