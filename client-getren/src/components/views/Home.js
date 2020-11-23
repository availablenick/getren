import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { logout } from '../../storage/user/userSlice';
import axios from 'axios';

class Home extends React.Component {
  render() {
    return (
      <div>
        <Link to='/cadastro'>Cadastro</Link>
        <br/>
        <Link to='/login'>Login</Link>
        <br/>
        <Link to='/perfil'>Perfil</Link>
        <button onClick={this.handleClick}>Sair</button>

        <div>{ this.props.user.data != null ? this.props.user.data.email : '' }</div>
        {/* <div>{ this.props.user.data != null ? this.props.user.data.password : '' }</div> */}
      </div>
    );
  }

  handleClick = () => {
    axios.get('http://localhost:5000/logout', { withCredentials: true})
      .then(response => {
        if (response.status === 200) {
          this.props.dispatch(logout());
        }
      });
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default connect(mapStateToProps)(Home);
