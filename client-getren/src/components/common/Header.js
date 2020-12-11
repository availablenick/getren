import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import api from '../../config/axios/api.js';
import { logout } from '../../storage/user/userSlice';
import './Header.scss';
import logo from '../../images/getren-logo.png';

class Header extends React.Component {
  render() {
    return (
      <header className='top-header w-100'>
        <nav className='d-flex justify-content-between align-items-center 
          w-100 h-100 px-5'
        >
          <div>
            <Link to='/'>
              <img src={logo} alt='getren-logo'></img>
            </Link>
          </div>
          
          <ul className='m-0 p-0'>
            <li>
              <Link to='/'>HOME</Link>
            </li>
            <li className='sub-menu-dropdown'>
              <Link to='/cursos'>
                CURSOS 
              </Link>
              <ul className='sub-menu d-flex flex-column position-absolute 
                left-0 p-0 text-white'
              >
                <li>
                  <Link to='/cursos'>
                    TODOS
                  </Link>
                </li>
                <li>
                  <a href='#'>
                    ABERTOS
                  </a>
                </li>
                <li>
                  <a href='#'>
                    ENCERRADOS
                  </a>
                </li>
                <li>
                  <a href='#'>
                    MEUS CURSOS
                  </a>
                </li>
                <li>
                  <a href='#'>
                    PERGUNTAS FREQUENTES
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a href='#'>
                SOBRE
              </a>
            </li>
            <li>
              <a href='#'>
                CONTATO
              </a>
            </li>
            { !this.props.user.data &&
              <li>
                <Link to='/login'>LOGIN</Link>
              </li>
            }
            { this.props.user.data &&
              <li>
                <Link to='/perfil'>PERFIL</Link>
              </li>
            }
            { this.props.user.data &&
              <li>
                <button type='button' onClick={ this.handleClick }>SAIR</button>
              </li>
            }
          </ul>
        </nav>
      </header>
    );
  }

  handleClick = (event) => {
    event.preventDefault();

    api.get('logout')
      .then(response => {
        if (response.status === 200) {
          this.props.dispatch(logout());
        }
      });
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default connect(mapStateToProps)(Header);
