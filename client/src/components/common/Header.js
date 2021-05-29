import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import api from '../../config/axios/api.js';
import { logout } from '../../storage/user/userSlice';
import './Header.scss';
import logo from '../../images/getren-logo.png';

class Header extends React.Component {
  componentDidMount() {
    let submenuDropdowns = document.getElementsByClassName('submenu-dropdown'); 
    let submenuTriggers = document.getElementsByClassName('submenu-trigger');
    for (let trigger of submenuTriggers) {
      trigger.addEventListener('mouseenter', () => {
        trigger.nextElementSibling.style.display = 'flex';
        trigger.nextElementSibling.setAttribute(
          'class',
          'submenu flex-column position-absolute left-0 p-0 text-white'
        );
        trigger.nextElementSibling.setAttribute(
          'class',
          'submenu flex-column position-absolute left-0 p-0 text-white fade-in'
        );
      });
    }

    for (let dropdown of submenuDropdowns) {
      dropdown.addEventListener('mouseleave', () => {
        dropdown.getElementsByClassName('submenu')[0].setAttribute(
          'class',
          'submenu flex-column position-absolute left-0 p-0 text-white'
        );
        dropdown.getElementsByClassName('submenu')[0].setAttribute(
          'class',
          'submenu flex-column position-absolute left-0 p-0 text-white fade-out'
        );

        dropdown.getElementsByClassName('submenu')[0].addEventListener(
          'animationend', () => {
            dropdown.getElementsByClassName('submenu')[0].style.display = 'none';
          }
        )
      });
    }
  }

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
            <li className='submenu-dropdown'>
              <Link className='submenu-trigger' to='/cursos'>
                CURSOS 
              </Link>
              <ul className='submenu flex-column position-absolute left-0 p-0
                text-white'
              >
                <li>
                  <Link to='/cursos'>
                    TODOS
                  </Link>
                </li>
                <li>
                  <a href='/#'>
                    ABERTOS
                  </a>
                </li>
                <li>
                  <a href='/#'>
                    ENCERRADOS
                  </a>
                </li>
                <li>
                  <a href='/#'>
                    MEUS CURSOS
                  </a>
                </li>
                <li>
                  <a href='/#'>
                    PERGUNTAS FREQUENTES
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a href='/sobre'>
                SOBRE
              </a>
            </li>
            <li>
              <Link to='/contato'>CONTATO</Link>
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
                <button type='button' onClick={this.handleClick}>SAIR</button>
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
