import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from "react-router-dom";
import store from './storage/store.js';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

import './config/fontawesome/library.js';
import './index.scss';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
