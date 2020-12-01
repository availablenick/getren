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
      <header className='top-header'>
        <nav className='navbar navbar-expand-md'>
          <div className='container-fluid'>
            <a className='navbar-brand' href='/'>
              <img src={logo} alt='getren-logo'></img>
            </a>
          </div>

          <ul className='navbar-nav mr-auto d-none d-lg-flex'>
            <li className='nav-item active mr-4'>
              <Link className='nav-link' to='/'>HOME</Link>
            </li>
            <li className='nav-item active mr-4'>
              <Link className='nav-link' to='/cursos'>CURSOS</Link>
            </li>
            <li className='nav-item active mr-4'>
              <a className='nav-link about' href='#'>SOBRE</a>
            </li>
            <li className='nav-item active mr-4'>
              <a className='nav-link' href='#'>CONTATO</a>
            </li>

            { !this.props.user.data &&
              <li className='nav-item active'>
                <Link className='nav-link' to='/login'>LOGIN</Link>
              </li>
            }

            { this.props.user.data &&
              <li className='nav-item active mr-4'>
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
