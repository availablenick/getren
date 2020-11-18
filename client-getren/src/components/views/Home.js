import React from 'react';
import { connect } from 'react-redux';

import { logout } from '../../storage/user/userSlice';
import './Home.scss';

import logo from '../../images/getren-logo-large.png';


class Home extends React.Component {
  render() {
    return (
      <>
        <div className='d-flex justify-content-center bg-image position-absolute'>
          <img src={logo} />
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
