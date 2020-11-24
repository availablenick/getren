import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Footer.scss';

function Footer() {
  return (
    <footer className='d-flex justify-content-center border-top 
      border-light py-3 align-items-center position-relative'
    >
      COPYRIGHT GETREN
      <nav className='position-absolute right-0 pr-5 social-media'>
        <a href='#' className='text-grey-to-white'><FontAwesomeIcon icon={['fab', 'facebook-square']} /></a>
        <a href='#' className='text-grey-to-white'><FontAwesomeIcon icon={['fab', 'instagram']} fixedWidth /></a>
        <a href='#' className='text-grey-to-white'><FontAwesomeIcon icon={['fab', 'youtube']} fixedWidth /></a>
        <a href='#' className='text-grey-to-white'><FontAwesomeIcon icon={['fab', 'twitter']} fixedWidth /></a>
      </nav>
    </footer>
  );
}

export default Footer;
