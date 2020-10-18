import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


function Home() {
  const user = useSelector(state => state.user);

  return (
    <div>
      <Link to='/users/new'>Cadastro</Link>
      <br/>
      <Link to='/login'>Login</Link>

      <div>{ user.email }</div>
      <div>{ user.password }</div>
    </div>
  );
}

export default Home;
