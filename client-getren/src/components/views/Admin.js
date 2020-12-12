import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import FormularioCurso from './FormularioCurso.js';
import FormularioVideo from './FormularioVideo.js';

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentToLoad: null,
      components: {
        'FormularioCurso': FormularioCurso,
        'FormularioVideo': FormularioVideo,
      }
    }
  }
  
  render() {
    let content = <></>;
    if (this.state.componentToLoad) {
      let Component = this.state.components[this.state.componentToLoad];
      content = <Component />; 
    } else {
      content = 
      <div>
        Olá {this.props.user.data.email}
      </div>
    }

    return (
      <div className='d-flex flex-row h-100 justify-content-around'>
        <ul className="nav nav-pills flex-column justify-content-between">
          <li className="nav-item">
            {/* <a className="nav-link active" component-to-load="FormularioCurso" onClick={this.handleMenuItemClick}>Cadastra Curso</a> */}
            <Link className="nav-link active" to='/admin/cadastrar-curso'>Cadastrar Curso</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link active" to='/cursos'>Cursos</Link>
          </li>
          <li className="nav-item">
            <a className="nav-link active" component-to-load="FormularioVideo" onClick={this.handleMenuItemClick}>Vídeos</a>
          </li>
        </ul>
        {content}
      </div>
    );
  }

  handleMenuItemClick = (event) => {
    event.preventDefault();

    let componentToLoad = event.target.getAttribute('component-to-load');
    this.setState({ componentToLoad: componentToLoad });
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Admin));