import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import axios from 'axios';


class Perfil extends React.Component {
  constructor(props) {
    super(props);

    if (!props.user.data) {
      props.history.push('/');
    }

    this.state = {
      user: {},
      selected_state: null,
    };
    this.states_list = [];

    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
          this.states_list = response.data.map((state, index) => {
            return (
              <option value={state.sigla} key={index} 
                selected={this.state.user.estado === state.sigla}>
                {state.sigla}
              </option>
            );
          });
      });
    let url = 'http://localhost:5000/user/' + props.user.data.id;
    axios.get(url)
      .then(response => {
        if (response.data.status === 200) {
          this.setState({user: response.data.user, selected_state: response.data.user.estado});
        }
      });
  }

  render() {
    return ( 
      <div>
        <h2>Perfil</h2><br/>
        <form>
          <span>Nome</span>
          <input type="text" value={this.state.user.nome} />
          <br/>
          <span>Email</span>
          <input type="text" value={this.state.user.email} disabled/>
          <span>Profissão</span>
          <input type="text" value={this.state.user.profissao} />
          <br/>
          <span>Data nascimento</span>
          <input type="date" value={this.state.user.data_nascimento} />
          <br/>
          <span>Estado</span>
          <select name="estado" onChange={this.handleChangeStates}>
            {this.states_list}
          </select>
          <br/>
          <span>Cidade</span>
          <select name="cidade" value={this.state.user.cidade}>
          </select>
          <br/>
          <button>Atualizar</button>
        </form>
      </div>
    );
  }

  handleChangeStates = (event) => {
    this.setState({selected_state: event.target.value});
    console.log(this.state.selected_state);
  }

}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Perfil));