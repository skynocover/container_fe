import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as antd from 'antd';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from './AppContext';
import 'antd/dist/antd.dark.min.css';

import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <antd.ConfigProvider renderEmpty={() => <div>No Data</div>}>
    <AppProvider>
      <App />
    </AppProvider>
  </antd.ConfigProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
