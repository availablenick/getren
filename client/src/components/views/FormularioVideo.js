import React from 'react';
import { withRouter } from 'react-router-dom';

import api from '../../config/axios/api.js';

class FormularioVideo extends React.Component {
  constructor(props){
    super(props);

    let method;
    if (props.match.path.includes('cadastrar')) {
      method = 'CADASTRAR';
    } else if (props.match.path.includes('editar')) {
      method = 'EDITAR';
    }

    this.state = {
      video: {
        title: '',
        description: '',
        duration: '',
        course_order: '',
        thumbnail: '',
        youtube_code: '',
      },
      courseId: props.match.params.id,
      message: null,
      inputModeUrl: true,
      method: method,
    };
  }

  componentDidMount() {
    if (this.state.method === 'EDITAR') {
      if (!this.props.location.video) {
        api.get('/videos/' + this.props.match.params.id)
          .then(response => {
            if (response.status === 200) {
              this.processVideoData(response.data);
            }
          }).catch(error => {
          });
      } else {
        this.processVideoData(this.props.location.video);
      }
    }
  }
  
  render() {
    let content;
    if (this.state.inputModeUrl) {
      content =
        (
        <div>
          <div>
            <label htmlFor='youtube_code'>Endereço do vídeo</label>
            <input className='w-100' type='text' id='youtube_code' name='youtube_code'
              onChange={this.handleInputChange}
              value={this.state.video.youtube_code !== null ? this.state.video.youtube_code : ''}
            />
          </div>
          <div className='flex-column pt-3'>
            <label className='w-100' htmlFor='thumbnail'>Endereço da thumbnail</label>
            <input className='w-100' type='text' id='thumbnail' name='thumbnail'
              onChange={this.handleInputChange}
              value={this.state.video.thumbnail !== null ? this.state.video.thumbnail : ''}
            />
          </div>
        </div>)
    } else {
      content = 
        (<div className='form-group'>
          <label htmlFor='video'>Vídeo</label>
          <input type='file' name='video' className='form-control-file' id='video' />
        </div>)
    }

    return(
      <div className='d-flex justify-content-center align-items-center
        flex-column h-100'
      >
        <h2>ADICIONAR VÍDEO</h2>
        <form className='form-login' style={{width: '30em'}} onSubmit={this.handleSubmit} method='post'>
          <div>
            <label htmlFor='title'>Título</label>
            <input className='w-100' type='text' id='title' name='title' 
              onChange={this.handleInputChange}
              value={this.state.video.title !== null ? this.state.video.title : ''}
            />
          </div>

          <div>
            <label htmlFor='description'>Descrição</label>
            <textarea className='w-100' rows='4' id='description' name='description'
              onChange={this.handleInputChange}
              value={this.state.video.description !== null ? this.state.video.description : ''}
            />
          </div>

          <div>
            <label htmlFor='duration'>Duração (min:seg)</label>
            <input className='w-100' type='text' id='duration' name='duration'
              onChange={this.handleInputChange}
              value={
                this.state.video.duration !== null ?
                this.state.video.duration
                :
                ''
              }
            />
          </div>

          <div>
            <label htmlFor='course_order'>Ordem no Curso</label>
            <input className='w-100' type='number' id='course_order' name='course_order'
              onChange={this.handleInputChange}
              value={this.state.video.course_order !== null ? this.state.video.course_order : ''}
            />
          </div>

          <div class="row align-items-center">
            <legend class="col-form-label col-sm-6 pt-0">Modo de envio do vídeo</legend>
            <div class="col-sm-10">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="option1" 
                    onChange={this.handleVideoInputChange} checked={this.state.inputModeUrl}/>
                    <label class="form-check-label" for="gridRadios1">
                        Por endereço do youtube
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="option2"
                    onChange={this.handleVideoInputChange} checked={!this.state.inputModeUrl}/>
                    <label class="form-check-label" for="gridRadios2">
                        Por arquivo de vídeo
                    </label>
                </div>
            </div>
          </div>

          {content}        

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

    let headers;
    let videoData;

    if (this.state.inputModeUrl){
      videoData = this.state.video;
      var lastIndex = videoData['youtube_code'].lastIndexOf('/');
      videoData['youtube_code'] = videoData['youtube_code'].substring(lastIndex+1);
      headers = {headers: {'Content-Type': 'application/json'}};
    } else {      
      videoData = new FormData();
      let video = this.state.video;
      delete video['youtube_code'];
      delete video['thumbnail'];
      for (var key of Object.keys(video)){
        videoData.append(key, video[key]);
      }
      videoData.append('video', document.querySelector('#video').files[0]);
      headers = {'Content-Type': 'multipart/formdata'};
    }

    let preMessage;
    let postMessage;
    let request;

    if (this.state.method === "CADASTRAR"){
      preMessage = 'Cadastrando vídeo...';
      postMessage = 'Vídeo cadastrado!';
      request = api.post(`/courses/${this.state.courseId}/videos`, videoData, {
        headers: headers
      });
    } else {
      preMessage = 'Atualizando vídeo...';
      postMessage = 'Vídeo atualizado!';
      let id = this.props.match.params.id;
      request = api.put(`/videos/${id}`, videoData, {
        headers: headers
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
        video: {
          ...prevState.video,
          [field]: value,
        }
    }});
  }

  handleVideoInputChange = (event) => {
    this.setState(prevState => {
      return {
        inputModeUrl: !prevState.inputModeUrl
      }
    })
  }

  processVideoData = (video) => {
    video.youtube_code = '/' + video.youtube_code;
    let duration = video.duration;
    let minutes = Math.floor(duration/60);
    let seconds = duration % 60;
    video.duration = `${minutes}:${seconds}`
    this.setState({ video: video});
  }

}

export default withRouter(FormularioVideo);