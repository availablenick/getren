import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Spinner, Modal} from 'react-bootstrap';

import api from '../../config/axios/api.js';
import Video from './Video.js';

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
      videosData: null,
      currentVideo: 0,
    }
  }

  componentDidMount() {
    if (!this.state.course) {
      api.get('/courses/' + this.state.courseId)
        .then(response => {
          if (response.status === 200) {
            this.setState({ course: response.data, isFetchingCourse: false });
          }
        }).catch(error => {
          this.props.history.push('/cursos');
        });
    }
    api.get('/courses/' + this.state.courseId + '/videos')
      .then(response => {
        if (response.status === 200) {
          this.setState({videosData: response.data});
        }
      }).catch(error => {
      });
  }

  render() {
    let extraButtons = <></>;
    const courseToObject = {
      pathname: '/admin/editar-curso/' + this.state.courseId,
      course: this.state.course,
    };
    let videoToObject;
    if (this.state.videosData) {
      videoToObject = {
        pathname: '/admin/editar-video/' + this.state.videosData[this.state.currentVideo].id,
        video: this.state.videosData[this.state.currentVideo],
      }
    }
    //REFATORAR

    extraButtons = 
      <>
        <Link className='btn btn-warning' to={courseToObject}>Editar curso</Link>
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
        <Link className='btn btn-primary' to={`/admin/cadastrar-video/${this.state.courseId}`}>Adicionar vídeo</Link>
        <Link className='btn btn-secondary' to={videoToObject}>
          Editar vídeo atual
        </Link>
      </>    

    let videosList;

    if (this.state.videosData) {
      videosList = this.state.videosData.map((video, i) => {
        return (
          <li className="nav-item btn align-self-start" onClick={this.handleVideoChange} videoid={i}>
              Aula {i+1} - {video.title}
          </li>
        )
      })  
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
      <div className='d-flex flex-column w-100'>
        <div className='d-flex flex-row justify-content-between'>
          <h1 className='align-self-center ml-5'>{this.state.course.name}</h1>
          <div className='pr-4'>
            {this.props.user.data && this.props.user.data.is_admin &&
                extraButtons}
          </div>
        </div>
        <div className='d-flex flex-row mt-4'>
          <ul className="nav nav-pills flex-column mx-5">
            {videosList}
          </ul>      
          {this.state.videosData && this.state.videosData.length > 0 
          && this.state.currentVideo < this.state.videosData.length &&
          <Video video={this.state.videosData[this.state.currentVideo]}/>}
        </div>
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

  handleVideoChange = (event) => {
    let newId = Number(event.target.getAttribute('videoid'));
    this.setState({currentVideo: newId})
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Curso));