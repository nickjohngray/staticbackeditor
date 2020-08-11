import React from 'react';
import Login from "./components/Login/login";
import {Provider} from 'react-redux';
import store from "./redux/store";
import Layout from "./components/Layout/Layout";
import './App.css'


function App() {
  return (
      <Provider store={store}>
      <div className="App">

            <Layout />

    </div>
      </Provider>
  );
}

export default App;
