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
      federal_states_options_list: [],
      cities_options_list: [],
      errors: {},
      update_succeeded: false
    };
  }
  
  componentDidMount = () => {
    let url = 'http://localhost:5000/user/' + this.props.user.data.id;
    axios.get(url)
      .then(response => {
        if (response.data.status === 200) {
          this.setState({
            user: response.data.user,
          });
        }

        return axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
      })
      .then(response => {
          let federal_states_options_list = response.data.map((state, index) => {
            return (
              <option value={state.sigla} key={index}>
                {state.sigla}
              </option>
            );
          });
          this.setState({
            federal_states_options_list: federal_states_options_list
          });
          return this.requestCitiesList(this.state.user.estado);
      })
      .then(response => {
        this.setState({ cities_options_list: response });
      });
  }

  render() {
    return (
      <div>
        <h2>Perfil</h2><br/>
        <form onSubmit={this.handleSubmit}>
          <span>Nome</span>
          <input type="text" name="name"
            defaultValue={this.state.user.nome !== null ? this.state.user.nome : ''}
          />
          <br/>
          <span>Email</span>
          <input type="text" name="email"
            defaultValue={this.state.user.email !== null ? this.state.user.email : ''}
            disabled
          />
          <br/>
          <span>Profissão</span>
          <input type="text" name="job"
            defaultValue={this.state.user.profissao !== null ? this.state.user.profissao : ''}
          />
          <br/>
          <span>Data nascimento</span>
          <input type="date" name="birthdate"
            defaultValue={this.state.user.data_nascimento !== null ? this.state.user.data_nascimento : ''}
          />
          <br/>
          <span>Estado</span>
          <select name="federal_state" defaultValue={this.state.user.estado}
            onChange={this.handleChangeStates}
          >
            {this.state.federal_states_options_list}
          </select>
          <br/>
          <span>Cidade</span>
          <select name="city" defaultValue={this.state.user.cidade}>
            {this.state.cities_options_list}
          </select>
          <br/>
          <button>Atualizar</button>
        </form>

        {this.state.update_succeeded &&
          <span>Perfil atualizado com sucesso</span>
        }
      </div>
    );
  }

  handleChangeStates = (event) => {
    event.persist();
    this.requestCitiesList(event.target.value)
      .then(response => {
        this.setState({
          cities_options_list: response
        });
      });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let form_data = new FormData(event.target);
    let request_data = {};
    for (let [key, value] of form_data.entries()) {
      request_data[key] = value;
    }
    axios.put('http://localhost:5000/user/' + this.props.user.data.id, request_data)
      .then(response => {
        if (response.data.status === 200) {
          this.setState({
            user: response.data.user,
            update_succeeded: true
          });
        }
      });
  }

  requestCitiesList = (federal_state) => {
    let cities_options_list = [];
    let federal_state_param = this.state.federal_states_options_list[0].props.value;
    if (federal_state !== null) {
      federal_state_param = federal_state;
    }
    let url = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + 
      federal_state_param + '/municipios';
    return new Promise(resolve => {
      axios.get(url)
        .then(response => {
          cities_options_list = response.data.map((city, index) => {
            return (
              <option value={city.nome} key={index}>
                  {city.nome}
              </option>
            );
          });
          resolve(cities_options_list);
        });
    });
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Perfil));