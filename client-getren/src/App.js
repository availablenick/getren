import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Footer from './components/common/Footer.js';
import routes from './config/router/routes.js';

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
    <div>
      <Switch>
        { routeComponents }
      </Switch>

      <Footer />
    </div>
  );
}

export default App;
