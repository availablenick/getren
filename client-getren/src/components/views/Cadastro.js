import React from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../utils/user/userSlice.js';
import { useHistory } from 'react-router-dom';

function Cadastro() {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(
      register({
        email: event.target.email.value,
        password: event.target.email.password,
      })
    );

    history.push('/');
  }

  return (
    <div>
      Página de cadastro
      <form onSubmit={handleSubmit} method='post'>
        <input type='text' name='email' placeholder='E-mail' />
        <br/>
        <input type='text' name='senha' placeholder='Senha' />
        <br/>
        <input type='text' name='confirmar_senha' placeholder='Confirmar senha' />
        <br/>
        <button>Cadastrar</button>
      </form>
    </div>
  );
}

export default Cadastro;
