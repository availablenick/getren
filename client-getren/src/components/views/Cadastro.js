import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect } from 'react-router-dom';
import axios from 'axios';

import { selectUserData, login } from '../../storage/user/userSlice';

function Cadastro() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectUserData);

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://0.0.0.0:5000/register', {
      email: event.target.email.value,
      password: event.target.password.value,
      password_confirm: event.target.password_confirm.value,
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
        Página de cadastro
        <form onSubmit={handleSubmit} method='post'>
          <input type='text' name='email' placeholder='E-mail' />
          <br/>
          <input type='text' name='password' placeholder='Senha' />
          <br/>
          <input type='text' name='password_confirm' placeholder='Confirmar senha' />
          <br/>
          <button>Cadastrar</button>
        </form>
      </div>
    );
  }
}

export default Cadastro;
