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
        <a href='/#' className='text-grey-to-white'>
          <FontAwesomeIcon icon={['fab', 'facebook-square']} />
        </a>
        <a href='https://www.instagram.com/_getren/' className='text-grey-to-white' 
          target='_blank' rel="noopener noreferrer">
          <FontAwesomeIcon icon={['fab', 'instagram']} fixedWidth />
        </a>
        <a href='https://www.youtube.com/channel/UCXmf23U-Muc7YMOXwYwrEXg' className='text-grey-to-white' 
          target='_blank' rel="noopener noreferrer">
          <FontAwesomeIcon icon={['fab', 'youtube']} fixedWidth />
        </a>
      </nav>
    </footer>
  );
}

export default Footer;
