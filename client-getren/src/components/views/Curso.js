import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Spinner, Modal} from 'react-bootstrap';

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
      message: "Tem certeza que deseja excluir esse curso? \
      (Usuários inscritos podem ser prejudicados e vídeos publicados serão perdidos.)",
      showModal: false,
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
          this.props.history.push('/cursos');
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
          <button className='btn btn-danger' onClick={this.handleShow}>
            Excluir curso
          </button>
          <Modal show={this.state.showModal} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Deletar Curso</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.state.message}</Modal.Body>
            <Modal.Footer>
              <button className='btn btn-secondary' onClick={this.handleClose}>
                Cancelar
              </button>
              <button className='btn btn-primary' onClick={this.handleDelete}>
                Confirmar
              </button>
            </Modal.Footer>
          </Modal>
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

  handleShow = () => this.setState({showModal: true});
  handleClose = () => this.setState({showModal: false});

  handleDelete = (event) => {
    let id = this.state.courseId;
    api.delete(`course/${id}`)
    .then(response => {
      if (response.status === 200) {
        this.props.history.push('/cursos');
      }
    }).catch(error => {
      this.setState({message: error.response.error});
    });
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Curso));