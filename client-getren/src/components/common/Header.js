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
        <nav className='navbar navbar-expand-md'>
          <div className='container-fluid'>
            <a className='navbar-brand' href='/'>
              <img src={logo} alt='getren-logo'></img>
            </a>
          </div>

          <ul className='navbar-nav mr-auto d-none d-lg-flex'>
            <li className='nav-item active pr-5'>
              <Link className='nav-link' to='/'>HOME</Link>
            </li>
            <li className='sub-menu-dropdown h-100 nav-item active pr-5 position-relative'>
              <a className='nav-link' href='#'>CURSOS</a>
              <ul className='sub-menu d-flex flex-column position-absolute 
                w-100 left-0 p-0 text-white'
              >
                <li className='p-2 list-style-type-none'>
                  TODOS
                </li>
                <li className='p-2 list-style-type-none'>
                  ABERTOS
                </li>
                <li className='p-2 list-style-type-none'>
                  ENCERRADOS
                </li>
                <li className='p-2 list-style-type-none'>
                  MEUS CURSOS
                </li>
                <li className='p-2 list-style-type-none'>
                  PERGUNTAS FREQUENTES
                </li>
              </ul>
            </li>
            <li className='nav-item active pr-5'>
              <a className='nav-link about' href='#'>SOBRE</a>
            </li>
            <li className='nav-item active pr-5'>
              <a className='nav-link' href='#'>CONTATO</a>
            </li>

            { !this.props.user.data &&
              <li className='nav-item active'>
                <Link className='nav-link' to='/login'>LOGIN</Link>
              </li>
            }

            { this.props.user.data &&
              <li className='nav-item active pr-5'>
                <Link className='nav-link' to='/perfil'>PERFIL</Link>
              </li>
            }

            { this.props.user.data &&
              <li className='nav-item active'>
                <a className='nav-link hand-cursor'
                  onClick={ this.handleClick }>SAIR</a>
              </li>
            }
          </ul>

          <button className='bars d-lg-none'>
            <FontAwesomeIcon icon='bars' />
          </button>
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
