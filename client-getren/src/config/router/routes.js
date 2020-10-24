import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Home from '../../components/views/Home.js';
import Cadastro from '../../components/views/Cadastro.js';
import Login from '../../components/views/Login.js';

import { selectUserData } from '../../storage/user/userSlice';

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
