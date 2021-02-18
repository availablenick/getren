import React from 'react';
import { withRouter } from 'react-router-dom';

import api from '../../config/axios/api.js';

class FormularioCurso extends React.Component {
  constructor(props){
    super(props);

    let method;
    if (props.match.path.includes('cadastrar')) {
      method = 'CADASTRAR';
    } else if (props.match.path.includes('editar')) {
      method = 'EDITAR';
    }

    this.thumbnailRef = React.createRef();

    this.state = {
      course: {
        name: '',
        price: 0,
        expires_at: new Date().toISOString().slice(0, 10),
        is_watchable: false,
        is_available: false,
      },
      message: null,
      method: method,
    };
  }

  componentDidMount() {
    if (this.state.method === 'EDITAR') {
      if (!this.props.location.course) {
        api.get('/course/' + this.props.match.params.id)
          .then(response => {
            if (response.status === 200) {
              this.setState({ course: response.data});
            }
          }).catch(error => {

          });
      } else {
        this.setState({ course: this.props.location.course});
      }
    }
  }
  
  render() {
    return(
      <div className='d-flex justify-content-center align-items-center
        flex-column h-100'
      >
        <h2>{this.state.method} CURSO</h2>
        <form className='form-login' style={{width: '30em'}} onSubmit={this.handleSubmit} method='post'>
          <div>
            <label htmlFor='name'>Nome</label>
            <input className='w-100' type='text' id='name' name='name' 
              onChange={this.handleInputChange}
              value={this.state.course.name !== null ? this.state.course.name : ''}
            />
          </div>

          <div>
            <label htmlFor='price'>Preço</label>
            <input className='w-100' type='number' id='price' name='price'
              onChange={this.handleInputChange}
              value={this.state.course.price !== null ? this.state.course.price : ''}
            />
          </div>

          <div>
            <label htmlFor='expires_at'>Data de Expiração</label>
            <input type='date' id='expires_at' name='expires_at'
              onChange={this.handleInputChange}
              value={
                this.state.course.expires_at !== null ?
                this.state.course.expires_at
                :
                ''
              }
            />
          </div>

          <div className='form-group'>
            <label htmlFor='thumbnail'>Thumbnail do curso</label>
            <input type='file' name='thumbnail' className='form-control-file' ref={this.thumbnailRef} />
          </div>

          <div className='form-check'>
            <input className='form-check-input' type='checkbox' name='is_watchable' 
              checked={this.state.course.is_watchable}
              onChange={this.handleInputChange} id='defaultCheck1' />
            <label className='form-check-label' htmlFor='defaultCheck1'>
              Disponível gratuitamente
            </label>
          </div>
          
          <div className='form-check'>
            <input className='form-check-input' type='checkbox' name='is_available' 
              checked={this.state.course.is_available}
              onChange={this.handleInputChange} id='defaultCheck2' />
            <label className='form-check-label' htmlFor='defaultCheck2'>
              Visível para usuários
            </label>
          </div>

          <div className='d-flex justify-content-center'>
            <button className='btn btn-primary'>{this.state.method}</button>
          </div>
        </form>

        {this.state.message &&
          <span>{this.state.message}</span>
        }
      </div>
    );
  }

  handleSubmit = (event) => {
    event.preventDefault();

    let courseData = new FormData();
    let course = this.state.course;
    if (course['price']) {
      course['price'] = course['price'].replace(',', '.');
    }
    courseData.append('json_args', JSON.stringify(course));
    if (this.thumbnailRef.current.files) {
      courseData.append('thumbnail', this.thumbnailRef.current.files[0]);
    }

    let preMessage, postMessage, request;

    if (this.state.method === "CADASTRAR"){
      preMessage = 'Cadastrando curso...';
      postMessage = 'Curso cadastrado!';
      request = api.post('/courses', courseData, {
        headers: {'Content-Type': 'multipart/form-data' }
      });
    } else {
      preMessage = 'Atualizando curso...';
      postMessage = 'Curso atualizado!';
      let id = this.props.match.params.id;
      request = api.put(`/course/${id}`, courseData, {
        headers: {'Content-Type': 'multipart/form-data' }
      });
    }
    
    this.setState({ message: preMessage});
    request.then(response => {
      if (response.status === 200) {
        this.setState({ message: postMessage});
        setTimeout(() => {
          this.setState({ message: null});
        }, 2000);
      }
    }).catch(error => {
      this.setState({ message: error.response.error});
    });
    
  }

  handleInputChange = (event) => {
    event.persist();

    let value;
    let field = event.target.name;
    if (event.target.type === 'checkbox') {
      value = event.target.checked;
    } else {
      value = event.target.value;
    }
    this.setState(prevState => { 
      return {
        course: {
          ...prevState.course,
          [field]: value,
        }
    }});
  }

}

export default withRouter(FormularioCurso);