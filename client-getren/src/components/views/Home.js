import React from 'react';
import { connect } from 'react-redux';

import { logout } from '../../storage/user/userSlice';
import './Home.scss';

class Home extends React.Component {
  render() {
    return (
      <div className='home flex-grow-1'>
        aew
      </div>
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
