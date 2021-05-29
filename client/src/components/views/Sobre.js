import React from 'react';
import { connect } from 'react-redux';

import api from '../../config/axios/api.js';

class Sobre extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      aboutUs: ''
    }
  }

  componentDidMount() {
    api.get('/texts/quem-somos')
      .then((response) => {
        const text = response.data.body;

        this.setState({ aboutUs: text });
      })
  }
  
  render() {
    return (
      <>
        <div className='d-flex justify-content-center align-items-center
        flex-column h-100'
        >
          <div dangerouslySetInnerHTML={{ __html: this.state.aboutUs }}></div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default connect(mapStateToProps)(Sobre);
