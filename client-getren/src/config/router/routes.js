import Home from '../../components/views/Home.js';
import Cadastro from '../../components/views/Cadastro.js';
import Login from '../../components/views/Login.js';
import Confirmacao from '../../components/views/Confirmacao.js';
import Perfil from '../../components/views/Perfil.js';

import Admin from '../../components/views/Admin.js';

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/cadastro',
    needsUserSignedOut: true,
    redirectTo: '/',
    component: Cadastro,
  },
  {
    path: '/login',
    needsUserSignedOut: true,
    redirectTo: '/',
    component: Login,
  },
  {
    path: '/confirmacao',
    component: Confirmacao,
  },
  {
    path: '/perfil',
    needsUserSignedIn: true,
    redirectTo: '/login',
    component: Perfil,
  },
  {
    path: '/admin',
    needsUserSignedIn: true,
    needsUserToBeAdmin: true,
    redirectTo: '/',
    component: Admin,
  }
];

export default routes;
