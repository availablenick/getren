import Home from '../../components/views/Home.js';
import Cadastro from '../../components/views/Cadastro.js';
import Login from '../../components/views/Login.js';
import Confirmacao from '../../components/views/Confirmacao.js';
import Perfil from '../../components/views/Perfil.js';
import Cursos from '../../components/views/Cursos.js';
import Curso from '../../components/views/Curso.js';
import CursoAlt from '../../components/views/CursoAlt.js';
import FormularioCurso from '../../components/views/FormularioCurso.js';
import Admin from '../../components/views/Admin.js';
import FormularioVideo from '../../components/views/FormularioVideo.js';
import Video from '../../components/views/Video.js';

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
    path: '/cursos/:id',
    component: CursoAlt,
  },
  {
    path: '/videos/:id',
    component: Video,
    needsUserSignedIn: false,
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
    path: '/admin/cadastrar-video/:id',
    component: FormularioVideo,
    needsUserToBeAdmin: true,
  },
  {
    path: '/admin/editar-video/:id',
    component: FormularioVideo,
    needsUserToBeAdmin: true,
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
