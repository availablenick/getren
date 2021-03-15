import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

import api from '../../config/axios/api.js';
import './Video.scss';
import logo from '../../images/getren-logo-large.png';

class Video extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isFetchingResources: true,
      otherVideos: [],
      video: null
    }
  }

  componentDidMount() {
    let id =  this.props.match.params.id;
    api.get('/videos/' + id)
      .then(response => {
        if (response.status === 200) {
          this.setState({ video: response.data });
        }

        return api.get('/courses/' + response.data.course_id + '/videos');
      })
      .then(response => {
        if (response.status === 200) {
          let otherVideos = response.data.map(video => {
            let thumbnail = video.thumbanail;
            if (!thumbnail) {
              thumbnail = logo;
            }

            return {
              ...video,
              thumbnail: thumbnail
            }
          });

          this.setState({
            otherVideos: otherVideos,
            isFetchingResources: false
          });
        }
      })
      .catch(error => {
        this.setState({
          error: error,
          isFetchingResources: false
        });
      });
  }

  componentDidUpdate(prevProps) {
    let currentId = this.props.match.params.id;
    let previousId = prevProps.match.params.id;
    if (currentId !== previousId) {
      api.get('/videos/' + currentId)
        .then(response => {
          if (response.status === 200) {
            this.setState({ video: response.data });
          }
        });
    }
  }

  render() {
    if (this.state.isFetchingResources) {
      return (
        <div className='d-flex flex-column align-items-center
          justify-content-center h-100'
        >
          <Spinner animation='border' size='lg' role='status'
            style={{ height: '5em', width: '5em' }}
          ></Spinner>
          <p className='mt-3'>Carregando informações...</p>
        </div>
      );
    } else if (this.state.error !== null) {
      console.log('this.state.error');
      console.log(this.state.error.response);
      if (this.state.error.response.status === 404) {
        return (
          <div className='h5 d-flex align-items-center justify-content-center
            h-100'
          >
            Este vídeo não existe.
          </div>
        );
      }
    }

    console.log(this.state.video);

    let otherVideosList = this.state.otherVideos.map((video, index) => {
      let itemContent =
        <>
          <div className='bg-white'>
            <img src={video.thumbnail} alt={video.title} style={{ width: '5em' }}/>
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
        </>;

      if (video.id === this.state.video.id) {
        return (
          <li key={index} className='d-flex text-white p-2'
            style={{ background: 'rgba(22, 34, 57, 0.95)' }}
          >
            {itemContent}
        </li>
        )
      }

      let videoPageURL = '/videos/' + video.id;
      return (
        <li key={index}>
          <Link className='d-flex custom-video-not-selected no-decoration p-2'
            to={videoPageURL}
          >
            {itemContent}
          </Link>
        </li>
      );
    });

    let videoURL = 'https://www.youtube.com/embed/'
      + this.state.video.youtube_code;

    return (
      <>
        <h1 className='pb-3'>{this.state.video.title}</h1>
        <div className='row'>
          <div className='col-8'>
            <iframe className='w-100' height='420'
              src={videoURL} frameBorder='0' title={this.state.video.title}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media;
                gyroscope; picture-in-picture'
              allowFullScreen
            ></iframe>

            <div className='h6 pt-3'>
              {this.state.video.description}
            </div>
          </div>

          <div className='col-4'>
            <div className='h-100'>
              <ul className='custom-list-style-type-none p-0'>
                { otherVideosList }
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Video));
