import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Header.scss';
import logo from '../../images/getren-logo.png';

function Header() {
  return (
    <header className='top-header'>
      <nav className='navbar navbar-expand-md'>
        <div className='container-fluid'>
          <a className='navbar-brand' href='/'>
            <img src={logo}></img>
          </a>
        </div>

        <ul className='navbar-nav mr-auto d-none d-lg-flex'>
          <li className='nav-item active mr-4'>
            <Link className='nav-link' to='/'>HOME</Link>
          </li>
          <li className='nav-item active mr-4'>
            <a className='nav-link' href='#'>CURSOS</a>
          </li>
          <li className='nav-item active mr-4'>
            <a className='nav-link about' href='#'>SOBRE</a>
          </li>
          <li className='nav-item active mr-4'>
            <a className='nav-link' href='#'>CONTATO</a>
          </li>

          <li className='nav-item active'>
            <Link className='nav-link' to='/login'>LOGIN</Link>
          </li>
        </ul>

        <button className='bars d-lg-none'>
          <FontAwesomeIcon icon='bars' />
        </button>
      </nav>
    </header>
  );
}

export default Header;
