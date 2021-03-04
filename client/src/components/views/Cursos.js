import React from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';

import api from '../../config/axios/api.js';
import Pagination from '../common/Pagination.js';
import logo from '../../images/getren-logo-large.png';

class Cursos extends React.Component {
  constructor(props) {
    super(props);

    let currentPage = this.props.match.params.number ?
      Number(this.props.match.params.number) : 1;

    this.state = {
      courses: [],
      currentPage: currentPage,
      isFetchingCourses: true,
    };
  }

  componentDidMount() {
    api.get('/courses')
      .then(response => {
        if (response.status === 200) {
          let courses = response.data;
          for (let course of courses) {
            if (course.thumbnail) {
              course.thumbnail = 'data:image/jpeg;base64, ' + course.thumbnail;
            } else {
              course.thumbnail = logo;
            }
          }
          this.setState({
            courses: courses,
            isFetchingCourses: false
          });
        }
      }).catch(error => {
        if (error.response) {
        }
      });
  }

  render() {
    if (this.state.isFetchingCourses) {
      return (
        <div className='d-flex flex-column align-items-center
          justify-content-center h-100'
        >
          <Spinner animation='border' size='lg' role='status'
            style={ { height: '5em', width: '5em' } }
          ></Spinner>
          <p className='mt-3'>Carregando lista de cursos...</p>
        </div>
      );
    } else {
      let coursesPerPage = 9;
      let firstIndex = (this.state.currentPage - 1) * coursesPerPage;
      let lastIndex = firstIndex + coursesPerPage;
      let pageAmount = Math.ceil(this.state.courses.length / coursesPerPage);
      const coursesToShow = this.state.courses.slice(firstIndex, lastIndex);
      const coursesList =
        <ul className='row p-0'>
          {
            coursesToShow.map((course, index) => {
              let pathname = '/cursos/' + course.id + '/comprar'

              return (
                <li key={index} className='d-flex justify-content-center col-12 col-lg-4'
                  style={{ listStyleType: 'none', marginBottom: '30px' }}
                >
                  <Link className='no-decoration' to={pathname}>
                    <Card className='border-0' style={{ width: '18rem' }}>
                      <Card.Img variant='top' src={course.thumbnail} />
                      <Card.Body className='text-center text-dark bg-getren-color'>
                        <Card.Title>{course.name}</Card.Title>
                      </Card.Body>
                    </Card>
                  </Link>
                </li>
              )
            })
          }
        </ul>

      let info = {
        pageAmount: pageAmount,
        currentPage: this.state.currentPage,
      };

      return (
        <>
          <h1 className='display-4 text-center mb-5'>Cursos</h1>
          {coursesList}

          <Pagination info={info} onClick={(page) => {
              this.props.history.push('/cursos/page/' + page);
              this.setState({ currentPage: page });
          }}/>
        </>
      )
    }
  }

  handleClick = (event) => {
    event.preventDefault();
    let pageToGo = Number(event.target.innerText);
    if (this.state.currentPage !== pageToGo) {
      this.props.history.push('/cursos/page/' + pageToGo);
      this.setState({ currentPage: pageToGo });
    }
  }
}

export default withRouter(Cursos);
