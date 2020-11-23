import React from 'react';

import Home from '../../components/views/Home.js';
import Cadastro from '../../components/views/Cadastro.js';
import Login from '../../components/views/Login.js';
import Confirmacao from '../../components/views/Confirmacao.js';
import Perfil from '../../components/views/Perfil.js';

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
    path: '/confirmacao',
    // component: Login,
    render: props => { 
      return (<Confirmacao />);
    },
  },
  {
    path: '/perfil',
    // component: Login,
    render: props => { 
      return (<Perfil />);
    },
  },
];

export default routes;
