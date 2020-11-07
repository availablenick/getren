import React from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';

class Confirmacao extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUserActivated: false
    };
  }

  componentDidMount() {
    let { email, token } = this.props.match.params;
    let url = 'http://0.0.0.0:5000/confirmation?email=' + email + '&token=' + token;
    axios.get(url)
    .then(response => {
      if (response.data.status === 200) {
        this.state.isUserActivated = true;
      }
    });
  }

  render() {
    let message = <h2>Houve algum problema</h2>;
    if (this.state.isUserActivated) {
      message = <h2>Usuário ativado com sucesso</h2>;
    }
    
    return (
      <div>
        { message }
        <br/>
        <Link to='/'>Home</Link>
      </div>
    );
  }
}

export default withRouter(Confirmacao);
