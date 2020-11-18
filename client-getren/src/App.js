import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from './components/common/Header.js';
import Footer from './components/common/Footer.js';
import routes from './config/router/routes.js';

import './App.scss';

function App() {
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

export default App;
