import React from 'react';
import { Spinner } from 'react-bootstrap';

import api from '../../config/axios/api.js';
import './Perfil.scss';
import logo from '../../images/getren-logo-large.png';
import Pagination from '../common/Pagination.js';

class TabMinhasCompras extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: [],
      isLoading: true,
      currentPage: 1,
    }
  }

  componentDidMount() {
    let user = this.props.user;
    api.get('user/' + user.id + '/courses')
    .then(response => {
      if (response.status === 200) {
        let processedCourses = response.data.map(course => {
          let thumbnail;
          if (!course.thumbnail) {
            thumbnail = logo;
          } else {
            thumbnail = 'data:image/jpeg;base64, ' + course.thumbnail;
          }
          return {
            ...course,
            thumbnail: thumbnail
          };
        });
        this.setState({ courses: processedCourses, isLoading: false });
      }
    });
  }

  render() {
    if (!this.state.isLoading) {
      let coursesPerPage = 5;
      let firstIndex = (this.state.currentPage - 1) * coursesPerPage;
      let lastIndex = firstIndex + coursesPerPage;
      let pageAmount = Math.ceil(this.state.courses.length / coursesPerPage);
      const coursesToShow = this.state.courses.slice(firstIndex, lastIndex);

      let info = {
        pageAmount: pageAmount,
        currentPage: this.state.currentPage,
      }

      return (
        <>
          <h2 className='border-bottom w-100 text-center pb-3'>MINHAS COMPRAS</h2>
          <ul className='mt-5 pl-5 w-100 '>
            { coursesToShow.map((course, index) => {
                return (
                  <li key={ index }
                    className='horizontal-card d-flex justify-content-center
                      mb-3 pb-3'
                    style={ { listStyleType: 'none' } }
                  >
                    <a className='no-decoration w-100' href='#'>
                      <div className='d-flex'>
                        <div className='bg-white'>
                          <img src={ logo } style={{ width: '15em' }}/>
                        </div>
                        <div className='px-3'>
                          <b>
                            { course.name }
                          </b>

                          <p>{ course.description }</p>
                        </div>
                      </div>
                    </a>
                  </li>
                )
              })
            }
          </ul>

          <Pagination info={info}
            onClick={(page) => this.setState({ currentPage: page })}
          />

          { this.state.courses.length <= 0 &&
            <p>
              Você ainda não se inscreveu em nenhum curso.
            </p>
          }
        </>
      )
    }
    return (
      <>
        <h2 className='border-bottom w-100 text-center pb-3'>MINHAS COMPRAS</h2>
        { this.state.isLoading && 
          <div className='d-flex flex-column justify-content-center align-items-center h-100' >
            <Spinner animation='border' size='lg' role='status'
              style={ { height: '3em', width: '3em' } }
            >
              <span className='sr-only'>Carregando cursos...</span>
            </Spinner>
            <span className='mt-2'>Carregando cursos...</span>
          </div>
        }
      </>
    )
  }
}

export default TabMinhasCompras;
