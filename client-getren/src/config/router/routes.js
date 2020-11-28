import Home from '../../components/views/Home.js';
import Cadastro from '../../components/views/Cadastro.js';
import Login from '../../components/views/Login.js';
import Confirmacao from '../../components/views/Confirmacao.js';
import Perfil from '../../components/views/Perfil.js';

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
];

export default routes;
