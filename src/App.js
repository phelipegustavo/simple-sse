import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import Facts from './Facts';
import { store } from './store';

function App() {
    return (
      <Provider store={store}>
        <Facts />
      </Provider>
  );
}

export default App;