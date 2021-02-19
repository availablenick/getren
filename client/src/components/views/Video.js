import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import api from '../../config/axios/api.js';
import logo from '../../images/getren-logo-large.png';

class Video extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      video: {},
      otherVideos: [],
      isFetchingVideo: false,
    }
  }

  componentDidMount() {
    api.get('video/' + this.props.match.params.id)
      .then(response => {
        if (response.status === 200) {
          this.setState({
            video: response.data,
            isFetchingVideo: false
          });
        }
      });

      let videos = [];
      for (let i = 0; i < 10; i++) {
        videos.push({
          title: 'Video ' + i,
          description: 'Description ' + i,
          thumbnail: logo
        });
      }

      this.setState({ otherVideos: videos })
  }

  render() {
    let otherVideosList = this.state.otherVideos.map(video => {
      return (
        <li className='d-flex pb-2' style={{ listStyleType: 'none' }}>
          <div className='bg-white'>
            <img src={ video.thumbnail } style={{ width: '5em' }}/>
          </div>
          <div className='d-flex flex-column justify-content-center
            flex-grow-1 p-2'
          >
            <div className='flex-grow-1' style={{ fontSize: '16px' }}>
              { video.title }
            </div>
            <div className='flex-grow-1' style={{ fontSize: '12px' }}>
              { video.description }
            </div>
          </div>
        </li>
      );
    });

    return (
      <>
        <h1 className='pb-3'>Sem título</h1>
        <div className='row'>
          <div className='col-8'>
            <iframe className='w-100' height='420'
              src='https://www.youtube.com/embed/jNQXAC9IVRw' frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowfullscreen
            ></iframe>

            <div className='h6 pt-3'>
              Faltou uma descrição aqui
            </div>
          </div>

          <div className='col-4'>
            <div className='h-100'>
              <ul className='p-0'>
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
