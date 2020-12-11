import React from 'react';
import { Card, Pagination } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import api from '../../config/axios/api.js';
import logo from '../../images/getren-logo-large.png';

class Cursos extends React.Component {
  constructor(props) {
    super(props);

    let courses = [];
    for (let i = 0; i < 54; i++) {
      courses[i] = {
        id: i,
        name: 'Rei dos cursos ' + i,
        number_of_videos: 100,
        duration: '4 anos',
        image: logo
      };
    }

    let currentPage = this.props.match.params.number ?
      Number(this.props.match.params.number) : 1
    ;

    this.state = {
      courses: courses,
      currentPage: currentPage
    };
  }

  componentDidMount() {
    // api.get('/courses')
    //   .then(response => {
    //     if (response.status === 200) {
    //       this.setState({ courses: response.data });
    //     }
    //   });
  }

  render() {
    let coursesPerPage = 9;
    let firstIndex = (this.state.currentPage - 1) * coursesPerPage;
    const coursesToShow = this.state.courses.slice(firstIndex, firstIndex + coursesPerPage);
    const coursesList =
      <ul className='row p-0'>
        {
          coursesToShow.map((course, index) => {
            return (
              <li key={ index } className='d-flex justify-content-center col-12 col-lg-4'
                style={ { listStyleType: 'none', marginBottom: '30px' } }
              >
                <a className='no-decoration' href='#'>
                  <Card className='border-0' style={{ width: '18rem' }}>
                    <Card.Img variant='top' src={ course.image } />
                    <Card.Body className='text-center text-dark bg-getren-color'>
                      <Card.Title>{ course.name }</Card.Title>
                    </Card.Body>
                  </Card>
                </a>
              </li>
            )
          })
        }
      </ul>

    let pageAmount = this.state.courses.length / coursesPerPage;
    let paginationItems = [];
    if (this.state.currentPage <= 3) {
      for (let i = 1; i <= 3; i++) {
        paginationItems.push(
          <Pagination.Item key={ i }
            active={ this.state.currentPage === i }
            onClick={ () => { this.setState({ currentPage: i }) } }
          >
            { i }
          </Pagination.Item>
        );
      }

      paginationItems.push(<Pagination.Ellipsis key={ 'e1' }/>);
      paginationItems.push(
        <Pagination.Item key={ pageAmount }
          onClick={ () => { this.setState({ currentPage: pageAmount }) } }
        >
          { pageAmount }
        </Pagination.Item>
      );
    } else if (this.state.currentPage > 3 && this.state.currentPage <= pageAmount - 3) {
      paginationItems.push(
        <Pagination.Item key={ 1 }
          onClick={ () => { this.setState({ currentPage: 1 }) } }
        >
          1
        </Pagination.Item>
      );
      paginationItems.push(<Pagination.Ellipsis key={ 'e1' } />);
      paginationItems.push(
        <Pagination.Item key={ this.state.currentPage } active>
          { this.state.currentPage }
        </Pagination.Item>
      );
      paginationItems.push(<Pagination.Ellipsis key={ 'e2' } />);
      paginationItems.push(
        <Pagination.Item key={ pageAmount }
          onClick={ () => { this.setState({ currentPage: pageAmount }) } }
        >
          { pageAmount }
        </Pagination.Item>
      );
    } else {
      paginationItems.push(
        <Pagination.Item key={ 1 }
          onClick={ () => { this.setState({ currentPage: 1 }) } }
        >
          1
        </Pagination.Item>
      );
      paginationItems.push(<Pagination.Ellipsis key={ 'e1' } />);
      for (let i = pageAmount - 2; i <= pageAmount; i++) {
        paginationItems.push(
          <Pagination.Item key={ i }
            active={ this.state.currentPage === i }
            onClick={ () => { this.setState({ currentPage: i }) } }
          >
            { i }
          </Pagination.Item>
        );
      }
    }

    return (
      <>
        <h1 className='display-4 text-center mb-5'>Cursos</h1>
        { coursesList }

        <Pagination className='d-flex justify-content-center children-no-border'>
          <Pagination.First
            disabled={ this.state.currentPage === 1 }
            onClick={ event => {
              event.preventDefault();
              this.props.history.push('/cursos/page/1');
              this.setState({ currentPage: 1 });
            } }
          />
          <Pagination.Prev
            disabled={ this.state.currentPage === 1 }
            onClick={ event => {
              event.preventDefault();
              this.props.history.push('/cursos/page/' + (this.state.currentPage - 1));
              this.setState(prevState => ({
                currentPage: prevState.currentPage - 1
              }));
            } }
          />
          
          { paginationItems }

          <Pagination.Next
            disabled={ this.state.currentPage === pageAmount }
            onClick={ event => {
              event.preventDefault();
              this.props.history.push('/cursos/page/' + (this.state.currentPage + 1));
              this.setState(prevState => ({
                currentPage: prevState.currentPage + 1
              }));
            } }
          />
          <Pagination.Last className='last-page'
            disabled={ this.state.currentPage === pageAmount } 
            onClick={ event => {
              event.preventDefault();
              this.props.history.push('/cursos/page/' + pageAmount);
              this.setState({ currentPage: pageAmount });
            } }
          />
        </Pagination>
      </>
    )
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
