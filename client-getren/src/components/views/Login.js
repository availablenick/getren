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

    axios.post('http://0.0.0.0:5000/login', {
      email: event.target.email.value,
      password: event.target.password.value,
    }).then(response => {
      if (response.data.status === 200) {
        dispatch(
          login({
            email: response.data.user.email,
            password: response.data.user.password,
          })
        );

        history.push('/');
      }
    });
  }

  if (user) {
    return (<Redirect to='/' />);
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
