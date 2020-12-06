import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import FormularioCurso from './FormularioCurso.js';

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentToLoad: null,
      components: {
        'FormularioCurso': FormularioCurso,
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
        Olá admin {this.props.user.data.email}
      </div>
    }

    return (
      <div className='d-flex flex-row h-100 justify-content-around'>
        <ul className="nav nav-pills">
          <li className="nav-item">
            <a className="nav-link active" component-to-load="FormularioCurso" onClick={this.handleMenuItemClick}>Cursos</a>
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