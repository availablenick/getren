import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Card, Spinner } from 'react-bootstrap';

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
      coursesFromUser: [],
      currentPage: currentPage,
      isFetchingResources: true,
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

          if (this.props.user.data) {
            this.setState({ courses: courses });
            return api.get('/users/' + this.props.user.data.id + '/courses');
          } else {
            this.setState({
              courses: courses,
              isFetchingResources: false,
            });
          }
        }
      }).then(response => {
        if (response && response.status === 200) {
          this.setState({
            coursesFromUser: response.data,
            isFetchingResources: false,
          });
        }
      });
  }

  render() {
    if (this.state.isFetchingResources) {
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
              let isEnrolled = false;
              let courses = this.state.coursesFromUser;
              let leftIndex = 0;
              let rightIndex = courses.length - 1;
              let middleIndex;
              while (rightIndex - leftIndex + 1 > 0) {
                middleIndex = Math.floor((leftIndex + rightIndex) / 2);
                if (course.id === courses[middleIndex].id) {
                  isEnrolled = true;
                  break;
                } else if (course.id > courses[middleIndex].id) {
                  leftIndex = middleIndex + 1;
                } else {
                  rightIndex = middleIndex - 1;
                }
              }

              let pathname;
              if (isEnrolled) {
                pathname = '/cursos/' + course.id + '/videos';
              } else {
                pathname = '/cursos/' + course.id + '/comprar';
              }

              return (
                <li key={index} className='d-flex justify-content-center col-12 col-lg-4'
                  style={{ listStyleType: 'none', marginBottom: '30px' }}
                >
                  <Link className='no-decoration' to={pathname}>
                    <Card className='border-0' style={{ width: '18rem' }}>
                      <Card.Img variant='top' src={course.thumbnail} />
                      <Card.Body className='text-center text-dark bg-getren-color'>
                        <Card.Title>{course.name}</Card.Title>
                        { isEnrolled && 
                          <Card.Text>
                            Você está inscrito neste curso
                          </Card.Text>
                        }
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

      console.log(coursesList.length);

      return (
        <>
          <h1 className='display-4 text-center mb-5'>Cursos</h1>
          {
            this.state.courses.length === 0 &&
            <h3 className='text-center'>Não há cursos disponíveis</h3>
          }
          {
            this.state.courses.length > 0 && 
            coursesList
          }
          <Pagination info={info} onClick={(page) => {
              this.props.history.push('/cursos/page/' + page);
              this.setState({ currentPage: page });
          }}/>
        </>
      );
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

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Cursos));
