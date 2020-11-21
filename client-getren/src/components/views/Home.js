import React from 'react';
import { connect } from 'react-redux';

import { logout } from '../../storage/user/userSlice';
import logo from '../../images/getren-logo-large.png';
import './Home.scss';

class Home extends React.Component {
  render() {
    return (
      <>
        <div className='d-flex justify-content-center bg-image position-absolute
          w-100 h-100'
        >
          <img className='img-fluid' src={logo} />
        </div>
      </>
    );
  }

  handleClick = () => {
    this.props.dispatch(logout());
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default connect(mapStateToProps)(Home);
