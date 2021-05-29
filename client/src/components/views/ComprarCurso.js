import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Toast } from 'react-bootstrap';

import api from '../../config/axios/api.js';
import './ComprarCurso.scss';
import logo from '../../images/getren-logo-large.png';

class ComprarCurso extends React.Component {
  constructor(props) {
    super(props);

    let message;
    if (this.props.location.state) {
      message = this.props.location.state.message;
    } else {
      message = null;
    }

    this.state = {
      course: null,
      message: message,
      groups: {
        all: {
          name: 'Todos',
          courses: [],
          isCollapsed: true,
          url: '/courses'
        },
        active: {
          name: 'Ativos',
          courses: [],
          isCollapsed: true,
          url: '/courses'
        },
        previous: {
          name: 'Anteriores',
          courses: [],
          isCollapsed: true,
          url: '/courses'
        },
        etc: {
          name: '...',
          courses: [],
          isCollapsed: true,
          url: '/courses'
        },
      },
      isFetchingResources: true,
      didUpdateSucceed: false,
    }
  }

  componentDidMount() {
    let id = this.props.match.params.id;
    if (this.state.message) this.setState({didUpdateSucceed: true});
    api.get('/courses/' + id)
      .then(response => {
        if (response.status === 200) {
          let course = response.data
          if (course.thumbnail) {
            course.thumbnail = 'data:image/jpeg;base64, ' + course.thumbnail;
          } else {
            course.thumbnail = logo;
          }

          this.setState({
            course: course,
          });

          var script = document.createElement("script");
          script.src = "https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js";
          script.type = "text/javascript";
          script.setAttribute("data-preference-id", course.preference_id);
          document.querySelector("#paymentDiv").appendChild(script);
        }

        let requests = Object.values(this.state.groups).map(group => {
          return api.get(group.url);
        });
        return Promise.all(requests);
      })
      .then(responses => {
        let i = 0;
        let groups = { ...this.state.groups };
        for (let group of Object.keys(groups)) {
          if (responses[i].status === 200) {
            groups[group].courses = responses[i].data;
          }

          i++;
        }

        this.setState({
          groups: groups,
          isFetchingResources: false
        });
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
                    <li key={index}
                      className='custom-courses-sidebar-group-item'
                    >
                      <button type='button'
                        disabled={
                          Number(this.props.match.params.id) === course.id
                        }
                      >
                        {course.name}
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
      <div>
        <div className='row h-100'>
          <div className='col-3 d-flex flex-column'>
            <div className='custom-input-with-icon mb-5'>

              <button className='custom-icon-item border-0 bg-transparent'
                type='button' style={{ color: '#999' }}
              >
                <FontAwesomeIcon icon='search' />
              </button>
            </div>

            { sidebarGroups }
          </div>

          <div className='col-9 d-flex flex-column h-100 pl-5'>
            { this.state.isFetchingResources &&
              <div className='d-flex flex-column align-items-center
                justify-content-center h-100'
              >
                <Spinner animation='border' size='lg' role='status'
                  style={{ height: '5em', width: '5em' }}
                ></Spinner>
                <p className='mt-3'>Carregando informações...</p>
              </div>
            }
            { !this.state.isFetchingResources &&
              <>
                <div className='mb-5'>
                  <div className='d-flex align-items-start mb-5'>
                    <div className='pr-5'>
                      <h1 className='mb-3'>{this.state.course.name}</h1>
                      <p className='text-break'>
                        Texto ...................................................
                        .........................................................
                        .........................................................
                        .........................................................
                        .........................................................
                        .........................................................
                        .........................................................
                        .........................................................
                        .........................................................
                        .........................................................
                        .........................................................
                        .........................................................
                        .........................................................
                        .........................................................
                      </p>
                    </div>
                    <div class='bg-white'>
                      <img src={this.state.course.thumbnail} width='350'
                        height='250' alt='course-thumbnail'
                      />
                    </div>
                  </div>

                  <div className='mb-5'>
                    Conteúdo ....................................................
                    .............................................................
                    .............................................................
                    .............................................................
                    .............................................................
                    .............................................................
                    .............................................................
                    .............................................................
                  </div>

                  <div>
                    Texto .......................................................
                    .............................................................
                    .............................................................
                    .............................................................
                    .............................................................
                    .............................................................
                    .............................................................
                    .............................................................
                  </div>
                </div>
              </>
            }
          </div>
        </div>
        <div className='float-right d-flex flex-column' width="30px" id="paymentDiv"></div>
        <Toast className='position-fixed'
          style={{ bottom: '1em', right: '1em', width: '30em' ,zIndex: '10' }}
          onClose={ () => { this.setState({ didUpdateSucceed: false }) } }
          show={ this.state.didUpdateSucceed } delay={ 3000 } autohide
        >
          <Toast.Header>
            <small>Há poucos segundos</small>
          </Toast.Header>
          <Toast.Body>{this.state.message}</Toast.Body>
        </Toast>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(ComprarCurso));
