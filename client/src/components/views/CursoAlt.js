import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './CursoAlt.scss';

class CursoAlt extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groups: {
        all: {
          name: 'Todos',
          courses: [],
          isCollapsed: true,
        },
        active: {
          name: 'Ativos',
          courses: [],
          isCollapsed: true,
        },
        previous: {
          name: 'Anteriores',
          courses: [],
          isCollapsed: true,
        },
        etc: {
          name: '...',
          courses: [],
          isCollapsed: true,
        },
      }
    }
  }

  componentDidMount() {
    console.log(this.props.match.params);
    let courses = [];
    for (let i = 0; i < 5; i++) {
      courses.push({
        id: i,
        name: 'Curso ' + i
      });
    }

    this.setState(prevState => {
      return {
        groups: {
          ...prevState.groups,
          all: {
            ...prevState.groups.all,
            courses: courses,
          }
        }
      };
    });
  }

  render() {
    let sidebarGroups = Object.keys(this.state.groups).map((group, index) => {
      return (
        <div key={ index } className='custom-courses-sidebar-group'>
          <button type='button'
            className='custom-outline-none-focus border-0 bg-transparent p-0'
            onClick={ () => {
              this.setState(prevState => {
                return {
                  groups: {
                    ...prevState.groups,
                    [group]: {
                      ...prevState.groups[group],
                      isCollapsed: !prevState.groups[group].isCollapsed
                    }
                  }
                };
              });
            } }
          >
            {
              this.state.groups[group].isCollapsed ?
              <FontAwesomeIcon icon='caret-right' fixedWidth />
              :
              <FontAwesomeIcon icon='caret-down' fixedWidth />
            }

            { this.state.groups[group].name }
          </button>

          { !this.state.groups[group].isCollapsed &&
            <ul className='m-0 p-0'>
              { 
                this.state.groups[group].courses.map((course, index) => {
                  return (
                    <li key={ index }
                      className='custom-courses-sidebar-group-item'
                    >
                      <button type='button'
                        disabled={ Number(this.props.match.params.id) === course.id }
                      >
                        { course.name }
                      </button>
                    </li>
                  );
                })
              }
            </ul>
          }
        </div>
      );
    });

    return (
      <div className='row'>
        <div className='col-3 d-flex flex-column'
          style={{ height: '500px' }}
        >
          <div className='custom-input-with-icon mb-5'>
            <input className='custom-border-rounded w-100 py-2
              custom-outline-blue-focus' type='text' placeholder='Buscar'
            />

            <button className='custom-icon-item border-0 bg-transparent'
              type='button' style={{ color: '#999' }}
            >
              <FontAwesomeIcon icon='search' />
            </button>
          </div>

          { sidebarGroups }
        </div>

        <div className='col-9 d-flex flex-column pl-5'>
          <div className='flex-grow-1 mb-5'>
            <div className='d-flex align-items-start mb-5'>
              <div className='flex-grow- pr-5'>
                <h1 className='mb-3'>Curso 1</h1>
                <p className='text-break'>
                  Texto texto texto texto texto texto texto texto texto texto
                  texto texto texto texto texto texto texto texto texto texto
                  texto texto texto texto texto texto texto texto texto texto
                  texto texto texto texto texto texto texto texto texto texto
                  texto texto texto texto texto texto texto texto texto texto
                  texto texto texto texto texto texto texto texto texto texto
                </p>
              </div>
              <div>
                <iframe width='350' height='250'
                  src='https://www.youtube.com/embed/jNQXAC9IVRw'
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className='mb-5'>
              Conteúdo conteúdo conteúdo conteúdo conteúdo conteúdo conteúdo
              conteúdo conteúdo conteúdo conteúdo conteúdo conteúdo conteúdo
              conteúdo conteúdo conteúdo conteúdo conteúdo conteúdo conteúdo
            </div>

            <div>
              Texto texto texto texto texto texto texto texto texto texto texto
              texto texto texto texto texto texto texto texto texto texto texto
              texto texto texto texto texto texto texto texto texto texto texto
            </div>
          </div>

          <div>
            <button type='button'
              className='btn btn-primary position-relative w-100 p-3'
            >
              Comprar
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(CursoAlt));
