import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { logout } from '../../storage/user/userSlice';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Link to='/cadastro'>Cadastro</Link>
        <br/>
        <Link to='/login'>Login</Link>
        <br/>
        <Link to='/confirmacao/example@gmail.com/12345'>Confirmação</Link>
        <br/>
        <button onClick={this.handleClick}>Sair</button>

        <div>{ this.props.user.data != null ? this.props.user.data.email : '' }</div>
        <div>{ this.props.user.data != null ? this.props.user.data.password : '' }</div>
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
