import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Spinner } from 'react-bootstrap';

import api from '../../config/axios/api.js';
import { logout } from '../../storage/user/userSlice';
import './Perfil.scss';
import FormularioPerfil from './FormularioPerfil.js';
import TabMinhasCompras from './TabMinhasCompras.js';

class Perfil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      selectedTab: 'perfil',
      currentPage: 1,
      isFetchingUser: true,
      courses: [],
    };
  }

  componentDidMount = () => {
    let url = 'user/' + this.props.user.data.id;
    api.get(url)
      .then(response => {
        if (response.status === 200) {
          this.setState({
            user: {
              ...response.data,
              id: this.props.user.data.id,
            },
            isFetchingUser: false,
          });
        }
      });
  }

  render() {
    let content = null;
    if (this.state.selectedTab === 'perfil') {
      content = 
        <>
          { this.state.isFetchingUser && 
            <div className='d-flex flex-column justify-content-center align-items-center h-100' >
              <Spinner animation='border' size='lg' role='status'
                style={ { height: '3em', width: '3em' } }
              >
                <span className='sr-only'>Carregando cursos...</span>
              </Spinner>
              <span className='mt-2'>Carregando cursos...</span>
            </div>
          }
          { !this.state.isFetchingUser && 
            <FormularioPerfil user={this.state.user}/>}
        </>
    } else if (this.state.selectedTab === 'minhasCompras') {
      content = <TabMinhasCompras user={this.state.user}/>;
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
                  disabled={ this.state.selectedTab === 'perfil' }
                  onClick={ this.handleSidebarClick }
                >
                  Perfil
                </button>
              </li>
              <li>
                <button name='minhas-compras' 
                  disabled={ this.state.selectedTab === 'minhasCompras'}
                  onClick={ this.handleSidebarClick }
                >
                  Minhas Compras
                </button>
              </li>
              <li>
                <button name='sair'
                  onClick={ this.handleSidebarClick }
                >
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
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Perfil));