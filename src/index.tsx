import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'


ReactDOM.render(
  <React.StrictMode>
      <Router>
          <Switch>
            <Route path={"/"}>
                <App />
            </Route>
          </Switch>
      </Router>
  </React.StrictMode>,
  document.getElementsByTagName('body')[0]
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
