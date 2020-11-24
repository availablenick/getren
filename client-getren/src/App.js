import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from './components/common/Header.js';
import Footer from './components/common/Footer.js';
import routes from './config/router/routes.js';

import { login } from './storage/user/userSlice.js';
import api from './config/axios/api.js';
import './App.scss';

class App extends React.Component {
  componentDidMount() {
    api.get('user_by_token')
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
      <div className='d-flex flex-column h-100'>
        <Header />

        <div className='flex-grow-1 p-5 bg-getren-color container-fluid position-relative'>
          <Switch>
            { routeComponents }
          </Switch>
        </div>
  
        <Footer />
      </div>
    );
  }
}

export default connect()(App);
