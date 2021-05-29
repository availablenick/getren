import React from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import api from '../../config/axios/api.js';

class Pagamento extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      message: null,
      routeToGo: null,
    }
  }

  componentDidMount(){
    let status = this.props.match.params.status;
    if (status === "success") {
      let token = this.props.match.params.token;
      let user = this.props.user.data;
      api.get('/users/'+user.id+'/lastCourseToken').then(response => {
          let lastToken = response.data.lastToken;
          if (lastToken === token) {
            let courseId = this.props.match.params.id;
            api.post('/users/'+user.id+'/courses', {course_id: courseId}).then(response => {
              if (response.status === 200)
                this.setState({message: "A compra foi bem realizada.", routeToGo:'/cursos/'+this.props.match.params.id+'/videos'});
              else
                this.setState({message: "Ocorreu um erro ao registrar sua inscrição no curso. Contate os administradores para regularizar a situação.",
                                routeToGo:'/cursos/'+this.props.match.params.id+'/comprar'});
            })
          } 
      });
    } else if (status === "pending"){
      this.setState({message: "Sua compra está sendo processada. Aguarde confirmação.", routeToGo:'/cursos/'+this.props.match.params.id+'/comprar'});
    } else if (status === "failure") {
      this.setState({message: "Algum erro ocorreu na sua compra. Tente novamente.", routeToGo:'/cursos/'+this.props.match.params.id+'/comprar'});
    } else {
      this.setState({routeToGo:'/'});
    }
  }
  render() {
    return (
      <div>
        { !this.state.routeToGo &&
              <div className='d-flex flex-column align-items-center
                justify-content-center h-100'
              >
                <Spinner animation='border' size='lg' role='status'
                  style={{ height: '5em', width: '5em' }}
                ></Spinner>
                <p className='mt-3'>Carregando informações...</p>
              </div>
            }
        {this.state.routeToGo && <Redirect to = {{pathname: this.state.routeToGo, state: {message: this.state.message}}}/>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Pagamento));
