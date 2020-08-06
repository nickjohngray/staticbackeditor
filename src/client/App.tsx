import React from 'react';
import {Login} from "./components/login";
import Tree from "./components/Tree";
import {Provider} from 'react-redux';
import store from "./redux/store";
import Layout from "./components/Layout/Layout";


function App() {
  return (
      <Provider store={store}>
      <div className="App">

      {/*  <Tree />*/}
      {/*  <Login/>*/}
      <Layout />
    </div>
      </Provider>
  );
}

export default App;
