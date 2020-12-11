import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Pagination, Spinner, Toast } from 'react-bootstrap';

import axios from 'axios';
import api from '../../config/axios/api.js';
import { logout } from '../../storage/user/userSlice';
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
      selectedTab: 'perfil',
      currentPage: 1,
      isLoading: true,
      courses: [],
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

        return new Promise((resolve) => {
          setTimeout(() => { 
            let courses = [];
            for (let i = 0; i < 50; i++) {
              courses[i] = {
                id: i,
                name: 'Rei dos cursos ' + i,
                number_of_videos: 100,
                description: 'Descrição do curso',
                duration: '4 anos',
                image: logo
              };
            }
  
            resolve(courses);
          }, 1000);
        });
      })
      .then(courses => {
        this.setState({ courses: courses, isLoading: false });
      });
  }

  render() {
    let content = null;
    if (this.state.selectedTab === 'perfil') {
      content = 
        <>
          <h2 className='border-bottom w-100 text-center pb-3'>PERFIL</h2>
          <form className='form-login w-75 p-5' onSubmit={ this.handleSubmit } method='post'>
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
        </>;
    } else if (this.state.selectedTab === 'minhasCompras') {
      let coursesPerPage = 5;
      let firstIndex = (this.state.currentPage - 1) * coursesPerPage;
      let lastIndex = firstIndex + coursesPerPage;
      let pageAmount = this.state.courses.length / coursesPerPage;
      const coursesToShow = this.state.courses.slice(firstIndex, lastIndex);

      let paginationItems = [];

      if (this.state.currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          paginationItems.push(
            <Pagination.Item key={ i }
              active={ this.state.currentPage === i }
              onClick={ () => { this.setState({ currentPage: i }) } }
            >
              { i }
            </Pagination.Item>
          );
        }

        paginationItems.push(<Pagination.Ellipsis key={ 'e1' }/>);
        paginationItems.push(
          <Pagination.Item key={ pageAmount }
            onClick={ () => { this.setState({ currentPage: pageAmount }) } }
          >
            { pageAmount }
          </Pagination.Item>
        );
      } else if (this.state.currentPage > 3 && this.state.currentPage <= pageAmount - 3) {
        paginationItems.push(
          <Pagination.Item key={ 1 }
            onClick={ () => { this.setState({ currentPage: 1 }) } }
          >
            1
          </Pagination.Item>
        );
        paginationItems.push(<Pagination.Ellipsis key={ 'e1' } />);
        paginationItems.push(
          <Pagination.Item key={ this.state.currentPage } active>
            { this.state.currentPage }
          </Pagination.Item>
        );
        paginationItems.push(<Pagination.Ellipsis key={ 'e2' } />);
        paginationItems.push(
          <Pagination.Item key={ pageAmount }
            onClick={ () => { this.setState({ currentPage: pageAmount }) } }
          >
            { pageAmount }
          </Pagination.Item>
        );
      } else {
        paginationItems.push(
          <Pagination.Item key={ 1 }
            onClick={ () => { this.setState({ currentPage: 1 }) } }
          >
            1
          </Pagination.Item>
        );
        paginationItems.push(<Pagination.Ellipsis key={ 'e1' } />);
        for (let i = pageAmount - 2; i <= pageAmount; i++) {
          paginationItems.push(
            <Pagination.Item key={ i }
              active={ this.state.currentPage === i }
              onClick={ () => { this.setState({ currentPage: i }) } }
            >
              { i }
            </Pagination.Item>
          );
        }
      }

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
            <>
              <ul className='mt-5 pl-5 w-100 '>
                { coursesToShow.map((course, index) => {
                    return (
                      <li key={ index }
                        className='horizontal-card d-flex justify-content-center
                          mb-3 pb-3'
                        style={ { listStyleType: 'none' } }
                      >
                        <a className='no-decoration w-100' href='#'>
                          <div className='d-flex'>
                            <div className='bg-white'>
                              <img src={ logo } style={{ width: '15em' }}/>
                            </div>
                            <div className='px-3'>
                              <b>
                                { course.name }
                              </b>

                              <p>{ course.description }</p>
                            </div>
                          </div>
                        </a>
                      </li>
                    )
                  })
                }
              </ul>

              <Pagination className='children-no-border'>
                <Pagination.First disabled={ this.state.currentPage === 1 }
                  onClick={ () => { this.setState({ currentPage: 1 }) } }
                />
                <Pagination.Prev disabled={ this.state.currentPage === 1 }
                  onClick={ () => {
                    this.setState(prevState =>
                      ({ currentPage: prevState.currentPage - 1 })
                    )
                  } }
                />

                { paginationItems }

                <Pagination.Next disabled={ this.state.currentPage === pageAmount }
                  onClick={ () => {
                    this.setState(prevState =>
                      ({ currentPage: prevState.currentPage + 1 })
                    )
                  } }
                />
                <Pagination.Last disabled={ this.state.currentPage === pageAmount }
                  onClick={ () => { this.setState({ currentPage: pageAmount }) } }
                />
              </Pagination>
            </>
          }
        </>;
    }

    return (
      <div className='d-flex justify-content-center
        h-100 w-100'
      >
        <div className='row w-100 m-0 p-0'>
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
      api.get('logout')
        .then(response => {
          if (response.status === 200) {
            this.props.dispatch(logout());
            this.props.history.push('/');
          }
        });
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