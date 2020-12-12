import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

import api from '../../config/axios/api.js';

class Curso extends React.Component {
  constructor(props) {
    super(props);
    
    let hasCourseOnProps = false;
    if (props.location.course) {
      hasCourseOnProps = true;
    }
    
    this.state = {
      course: hasCourseOnProps ? props.location.course : null,
      isFetchingCourse: !hasCourseOnProps,
      courseId: props.match.params.id,
    }
  }

  componentDidMount() {
    if (!this.state.course) {
      api.get('/course/' + this.state.courseId)
        .then(response => {
          if (response.status === 200) {
            this.setState({ course: response.data, isFetchingCourse: false });
          }
        }).catch(error => {

        });
    }
  }

  render() {
    let extraButtons = <></>;
    if (this.props.user.data && this.props.user.data.is_admin) {
      const toObject = {
        pathname: '/admin/editar-curso/' + this.state.courseId,
        course: this.state.course,
      }
      
      extraButtons = 
        <div>
          <Link className='btn btn-warning' to={toObject}>Editar curso</Link>
          <button className='btn btn-danger'>Excluir curso</button>
        </div>
    }

    if (this.state.isFetchingCourse) {
      return (
        <Spinner animation='border' size='lg' role='status'
          style={ { height: '5em', width: '5em' } }
        >
          <span className='sr-only'>Carregando...</span>
        </Spinner>
      );
    } 
    return (
      <div>
        {this.state.course.name}
        {extraButtons}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Curso));