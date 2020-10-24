import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { selectUserData, logout } from '../../storage/user/userSlice';

function Home() {
  
  const user = useSelector(selectUserData);
  const dispatch = useDispatch();

  const handleClick = event => {
    dispatch(logout());
  }

  return (
    <div>
      <Link to='/cadastro'>Cadastro</Link>
      <br/>
      <Link to='/login'>Login</Link>
      <button onClick={handleClick}>Sair</button>

      <div>{ user != null ? user.email : '' }</div>
      <div>{ user != null ? user.password : '' }</div>
    </div>
  );
}

export default Home;
