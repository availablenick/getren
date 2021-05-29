import Admin from '../../components/views/Admin.js';
import Cadastro from '../../components/views/Cadastro.js';
import ComprarCurso from '../../components/views/ComprarCurso.js';
import Confirmacao from '../../components/views/Confirmacao.js';
import Contato from '../../components/views/Contato.js';
import Cursos from '../../components/views/Cursos.js';
import FormularioCurso from '../../components/views/FormularioCurso.js';
import FormularioTextos from '../../components/views/FormularioTextos';
import FormularioVideo from '../../components/views/FormularioVideo.js';
import Home from '../../components/views/Home.js';
import Login from '../../components/views/Login.js';
import NotFound from '../../components/views/NotFound.js';
import Pagamento from '../../components/views/Pagamento.js';
import Perfil from '../../components/views/Perfil.js';
import Sobre from '../../components/views/Sobre.js';
import Video from '../../components/views/Video.js';
import Videos from '../../components/views/Videos.js';

const routes = [
  {
    component: Home,
    exact: true,
    isAvailableTo: () => true,
    path: '/'
  },
  {
    component: Contato,
    isAvailableTo: () => true,
    path: '/contato'
  },
  {
    component: Admin,
    exact: true,
    isAvailableTo: (user) => user.data && user.data.is_admin,
    path: '/admin',
    redirectTo: '/'
  },
  {
    component: FormularioCurso,
    isAvailableTo: (user) => user.data && user.data.is_admin,
    path: '/admin/cadastrar-curso'
  },
  {
    component: FormularioVideo,
    isAvailableTo: (user) => user.data && user.data.is_admin,
    path: '/admin/cadastrar-video/:id'
  },
  {
    component: FormularioCurso,
    isAvailableTo: (user) => user.data && user.data.is_admin,
    path: '/admin/editar-curso/:id'
  },
  {
    component: FormularioVideo,
    isAvailableTo: (user) => user.data && user.data.is_admin,
    path: '/admin/editar-video/:id'
  },
  {
    component: FormularioTextos,
    isAvailableTo: (user) => user.data && user.data.is_admin,
    path: '/admin/textos'
  },
  {
    component: Cadastro,
    isAvailableTo: () => true,
    path: '/cadastro',
  },
  {
    component: Confirmacao,
    isAvailableTo: () => true,
    path: '/confirmacao'
  },
  {
    component: Cursos,
    exact: true,
    isAvailableTo: () => true,
    path: '/cursos'
  },
  {
    component: Cursos,
    isAvailableTo: () => true,
    path: '/cursos/page/:number'
  },
  {
    component: ComprarCurso,
    isAvailableTo: (user) => user.data,
    path: '/cursos/:id/comprar',
    redirectTo: '/'
  },
  {
    component: Pagamento,
    isAvailableTo: (user) => user.data,
    path: '/cursos/:id/:status/:token',
  },
  {
    component: Videos,
    exact: true,
    isAvailableTo: (user) => user.data,
    path: '/cursos/:id/videos',
    redirectTo: '/'
  },
  {
    component: Login,
    isAvailableTo: (user) => !user.data,
    path: '/login',
    redirectTo: '/'
  },
  {
    component: Perfil,
    isAvailableTo: (user) => user.data,
    path: '/perfil',
    redirectTo: '/login'
  },
  {
    component: Sobre,
    isAvailableTo: () => true,
    path: '/sobre'
  },
  {
    component: Video,
    isAvailableTo: (user) => user.data,
    path: '/videos/:id',
    redirectTo: '/'
  },
  {
    component: NotFound,
    isAvailableTo: () => true,
    path: '*'
  }
];

export default routes;
