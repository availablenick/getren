import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import Footer from './components/common/Footer.js';
import routes from './config/router/routes.js';

import { login } from './storage/user/userSlice.js';

class App extends React.Component {
  
  componentDidMount() {
    axios.get('http://localhost:5000/validateToken', { withCredentials: true })
      .then(response => {
        if (response.status === 200) {
          this.props.dispatch(
            login({
              email: response.data.email,
              id: response.data.id,
            })
          );
        }
      });
  }

  render() {
    const routeComponents = routes.map((route, i) => {
      return (
      <Route key={i} 
        exact={ route.path === '/' }
        path={route.path}
        render={route.render}
      />
      );
    });
  
    return (
      <div>
        <Switch>
          { routeComponents }
        </Switch>
  
        <Footer />
      </div>
    );
  }

}

export default connect()(App);
