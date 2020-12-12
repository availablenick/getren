import Home from '../../components/views/Home.js';
import Cadastro from '../../components/views/Cadastro.js';
import Login from '../../components/views/Login.js';
import Confirmacao from '../../components/views/Confirmacao.js';
import Perfil from '../../components/views/Perfil.js';
import Cursos from '../../components/views/Cursos.js';
import Curso from '../../components/views/Curso.js';
import FormularioCurso from '../../components/views/FormularioCurso.js';

import Admin from '../../components/views/Admin.js';

const routes = [
  {
    path: '/',
    component: Home,
    exact: true
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
    path: '/cursos',
    component: Cursos,
    exact: true
  },
  {
    path: '/cursos/page/:number',
    component: Cursos,
  },
  {
    path: '/admin/cadastrar-curso',
    component: FormularioCurso,
    needsUserToBeAdmin: true,
  },
  {
    path: '/admin/editar-curso/:id',
    component: FormularioCurso,
    needsUserToBeAdmin: true,
  },
  {
    path: '/curso/:id',
    component: Curso,
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
