import React from 'react';

import Home from '../../components/views/Home.js';
import Cadastro from '../../components/views/Cadastro.js';
import Login from '../../components/views/Login.js';
import Confirmacao from '../../components/views/Confirmacao.js';

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
  },
  {
    path: '/confirmacao/:email/:token',
    // component: Login,
    render: props => { 
      return (<Confirmacao />);
    },
  }
];

export default routes;
