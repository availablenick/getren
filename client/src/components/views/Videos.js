import React from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter, Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

import api from '../../config/axios/api.js';
import './Videos.scss';
import logo from '../../images/getren-logo-large.png';

class Videos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      course: null,
      shouldRedirect: false,
      isFetchingResources: true,
      videos: []
    }
  }

  componentDidMount() {
    let id = this.props.match.params.id;
    let user = this.props.user.data;
    api.get('/courses/' + id)
      .then(response => {
        if (response.status === 200) {
          this.setState({ course: response.data });
        }
        
        api.get('/users/'+user.id+'/courses/'+id).then(response => {
          let enrolled = response.data.enrolled;
          if (enrolled) {
            return api.get('/courses/' + id + '/videos');
          } else {
            this.setState({shouldRedirect: true})
          }
          
        }).then(response => {
        if (response && response.status === 200) {
          let videos = response.data.map(video => {
            let thumbnail = video.thumbnail;
            if (!thumbnail) {
              thumbnail = logo;
            }

            return {
              ...video,
              thumbnail: thumbnail
            }
          });

          this.setState({
            isFetchingResources: false,
            videos: videos
          });
        }
      });
    });
  }

  render() {
    if (this.state.shouldRedirect) {
      return <Redirect to = {'/cursos/'+this.state.course.id+'/comprar'}/>
    }
    if (this.state.isFetchingResources) {
      return (
        <div className='d-flex flex-column align-items-center
          justify-content-center h-100'
        >
          <Spinner animation='border' size='lg' role='status'
            style={ { height: '5em', width: '5em' } }
          ></Spinner>
          <p className='mt-3'>Carregando lista de vídeos...</p>
        </div>
      );
    } else {
      if (this.state.videos.length === 0) {
        return (
          <>
            <h1 className='display-4 text-center mb-5'>
              Vídeos do curso {this.state.course.name}
            </h1>

            <h2 className='text-center mt-5'>Este curso não possui vídeos</h2>
          </>
        )
      }

      let videosList =
        <ul className='mx-auto w-75'>
          {
            this.state.videos.map((video, index) => {
              return (
                <li key={index} className='custom-list-style-type-none my-3'>
                  <Link className='custom-video-item d-flex text-white p-2'
                    to={'/videos/' + video.id}
                  >
                    <div className='bg-white'>
                      <img src={video.thumbnail} alt={video.title}
                        style={{ width: '5em' }}
                      />
                    </div>
                    <div className='d-flex flex-column justify-content-center
                      flex-grow-1 p-2'
                    >
                      <div className='flex-grow-1' style={{ fontSize: '16px' }}>
                        {video.title}
                      </div>
                      <div className='flex-grow-1' style={{ fontSize: '12px' }}>
                        {video.description}
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })
          }
        </ul>

      return (
        <>
          <h1 className='display-4 text-center mb-5'>
            Vídeos do curso {this.state.course.name}
          </h1>

          {videosList}
        </>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Videos));
