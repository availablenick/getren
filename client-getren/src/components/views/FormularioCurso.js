import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import api from '../../config/axios/api.js';

class FormularioCurso extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      course: {
        name: '',
        price: 0,
        expires_at: new Date().toISOString().slice(0, 10),
        is_watchable: false,
        is_available: false,
        thumbnail: '',
      },
      message: null,
    };
  }
  
  render() {
    return(
      <div className='d-flex justify-content-center align-items-center
        flex-column h-100'
      >
        <h2>CADASTRAR CURSO</h2>
        <form className='form-login' style={{width: '30em'}} onSubmit={this.handleSubmit} method='post'>
          <div>
            <label htmlFor='name'>Nome</label>
            <input type='text' id='name' name='name' 
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
            <label htmlFor='birthdate'>Data de Expiração</label>
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
            <input type='file' name='thumbnail' className='form-control-file' id='thumbnail' />
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
            <button className='btn btn-primary'>Cadastrar</button>
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
    course['price'] = course['price'].replace(',', '.');
    courseData.append('json_args', JSON.stringify(course)); 
    courseData.append('thumbnail', document.querySelector('#thumbnail').files[0]);
    
    this.setState({ message: 'Cadastrando curso...'});
    api.post('/courses', courseData, {
      headers: {'Content-Type': 'multipart/form-data' }
    }).then(response => {
      if (response.status === 200) {
        this.setState({ message: 'Curso cadastrado!'});
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

export default FormularioCurso;