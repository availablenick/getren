import Home from '../../components/views/Home.js';
import Cadastro from '../../components/views/Cadastro.js';
import Login from '../../components/views/Login.js';

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/users/new',
    component: Cadastro
  },
  {
    path: '/login',
    component: Login
  }
];

export default routes;
