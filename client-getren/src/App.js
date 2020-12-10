import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spinner } from 'react-bootstrap';

import Header from './components/common/Header.js';
import Footer from './components/common/Footer.js';
import routes from './config/router/routes.js';

import { login } from './storage/user/userSlice.js';
import api from './config/axios/api.js';
import './App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetchingUser: true
    };
  }

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
      }).finally(() => {
        this.setState({ isFetchingUser: false });
      }).catch(error => {});
  }

  render() {
    const routeComponents = routes.map((route, i) => {
      return (
        <Route key={i} 
          exact={ route.path === '/' }
          path={ route.path }
          render={ () => {
            if ((route.needsUserSignedIn && !this.props.user.data) ||
                (route.needsUserSignedOut && this.props.user.data)) {
              return <Redirect to={route.redirectTo} />;
            }

            return <route.component />;
          }}
        />
      );
    });

    return (
      <>
        <div className='d-flex flex-column h-100'
          style={ { opacity: (this.state.isFetchingUser ? '0.5' : '') } }
        >
          <Header />
            <div className='flex-grow-1 pb-5 px-5 bg-getren-color container-fluid
              position-relative' style={ { paddingTop: 'calc(4em + 3rem)' } }
            >
              { !this.state.isFetchingUser &&
                <Switch>
                  { routeComponents }
                </Switch>
              }
            </div>
          <Footer />
        </div>

        { this.state.isFetchingUser &&
          <div className='d-flex align-items-center justify-content-center
            flex-column flex-grow-1 p-5 position-absolute left-0 top-0
            w-100 h-100'
          >
            <Spinner animation='border' size='lg' role='status'
              style={ { height: '5em', width: '5em' } }
            >
              <span className='sr-only'>Carregando...</span>
            </Spinner>

            <span className='h5 mt-5'>Carregando...</span>
          </div>
        }
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user };
}

export default connect(mapStateToProps)(App);
