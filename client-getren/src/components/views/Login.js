import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect } from 'react-router-dom';
import axios from 'axios';

import { login, selectUserData } from '../../storage/user/userSlice.js';

function Login() {
  
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectUserData);


  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://localhost:5000/login', {
      email: event.target.email.value,
      password: event.target.password.value,
    }).then(response => {  
      dispatch(
        login({
          email: response.data.email,
          password: response.data.password,
        })
      );

      history.push('/');
    });
  }
  
  if (user) {
    return (<Redirect path='/' />);
  } else {
    return (
      <div>
        Página de login
        <form onSubmit={handleSubmit} method='post'>
          <input type='text' name='email' placeholder='E-mail' />
          <br/>
          <input type='text' name='password' placeholder='Senha' />
          <br/>
          <button>Entrar</button>
        </form>
      </div>
    );
  }
}

export default Login;
