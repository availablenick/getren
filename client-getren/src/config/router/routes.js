import React from 'react';

import Home from '../../components/views/Home.js';
import Cadastro from '../../components/views/Cadastro.js';
import Login from '../../components/views/Login.js';

const routes = [
  {
    path: '/',
    // component: Home,
    render: props => { 
      return (<Home />);
    },
  },
  {
    path: '/cadastro',
    // component: Cadastro,
    render: props => { 
      return (<Cadastro />);
    },
  },
  {
    path: '/login',
    // component: Login,
    render: props => { 
      return (<Login />);
    },
  }
];

export default routes;
