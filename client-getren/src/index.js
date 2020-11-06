import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Router } from "react-router";
import store from './storage/store.js';
import { Provider } from 'react-redux';
import history from './config/router/history.js';

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
