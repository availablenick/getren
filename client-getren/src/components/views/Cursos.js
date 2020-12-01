import React from 'react';
import { Button, Card } from 'react-bootstrap';

import api from '../../config/axios/api.js';
import logo from '../../images/getren-logo-large.png';

class Cursos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [
        {
          id: 0,
          name: 'Rei dos cursos',
          number_of_videos: 100,
          duration: '4 anos',
          image: logo
        },
        {
          id: 0,
          name: 'Rei dos cursos',
          number_of_videos: 100,
          duration: '4 anos',
          image: logo
        },
        {
          id: 0,
          name: 'Rei dos cursos',
          number_of_videos: 100,
          duration: '4 anos',
          image: logo
        },
        {
          id: 0,
          name: 'Rei dos cursos',
          number_of_videos: 100,
          duration: '4 anos',
          image: logo
        },
        {
          id: 0,
          name: 'Rei dos cursos',
          number_of_videos: 100,
          duration: '4 anos',
          image: logo
        },
        {
          id: 0,
          name: 'Rei dos cursos',
          number_of_videos: 100,
          duration: '4 anos',
          image: logo
        },
      ]
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
    const coursesList =
      <ul className='row p-0'>
        {
          this.state.courses.map(course => {
            return (
              <li className='col-3'
                style={ { listStyleType: 'none', marginBottom: '30px' } }
              >
                <a className='no-decoration' href='#'>
                  <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={ course.image } />
                    <Card.Body className='text-white'
                      style={ { background: 'rgba(22, 34, 57, 0.95)' } }
                    >
                      <Card.Title>{ course.name }</Card.Title>
                      <Card.Text>
                        Seja o rei dos cursos.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </a>
              </li>
            )
          })
        }
      </ul>

    return (
      <>
        <h1 className='display-4 text-center mb-5'>Cursos</h1>
        { coursesList }
      </>
    )
  }
}

export default Cursos;
