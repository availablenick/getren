import Admin from '../../components/views/Admin.js';
import Cadastro from '../../components/views/Cadastro.js';
import ComprarCurso from '../../components/views/ComprarCurso.js';
import Confirmacao from '../../components/views/Confirmacao.js';
import Cursos from '../../components/views/Cursos.js';
import FormularioCurso from '../../components/views/FormularioCurso.js';
import FormularioVideo from '../../components/views/FormularioVideo.js';
import Home from '../../components/views/Home.js';
import Login from '../../components/views/Login.js';
import Perfil from '../../components/views/Perfil.js';
import Video from '../../components/views/Video.js';
import Videos from '../../components/views/Videos.js';

const routes = [
  {
    path: '/',
    component: Home,
    exact: true
  },
  {
    path: '/admin',
    component: Admin,
    needsUserSignedIn: true,
    needsUserToBeAdmin: true,
    redirectTo: '/',
    exact: true,
  },
  {
    path: '/admin/cadastrar-curso',
    component: FormularioCurso,
    needsUserToBeAdmin: true,
  },
  {
    path: '/admin/cadastrar-video/:id',
    component: FormularioVideo,
    needsUserToBeAdmin: true,
  },
  {
    path: '/admin/editar-curso/:id',
    component: FormularioCurso,
    needsUserToBeAdmin: true,
  },
  {
    path: '/admin/editar-video/:id',
    component: FormularioVideo,
    needsUserToBeAdmin: true,
  },
  {
    path: '/cadastro',
    needsUserSignedOut: true,
    redirectTo: '/',
    component: Cadastro,
  },
  {
    path: '/confirmacao',
    component: Confirmacao,
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
    path: '/cursos/:id/comprar',
    component: ComprarCurso,
    needsUserSignedIn: true,
    redirectTo: '/',
  },
  {
    path: '/cursos/:id/videos',
    component: Videos,
    needsUserSignedIn: true,
    redirectTo: '/',
    exact: true
  },
  {
    path: '/login',
    needsUserSignedOut: true,
    redirectTo: '/',
    component: Login,
  },
  {
    path: '/perfil',
    needsUserSignedIn: true,
    redirectTo: '/login',
    component: Perfil,
  },
  {
    path: '/videos/:id',
    component: Video,
    needsUserSignedIn: true,
    redirectTo: '/',
  }
];

export default routes;
