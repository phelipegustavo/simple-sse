import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Facts from './Facts';
import { store } from './store';


function Hello() {
  return (
    <>
      <Link to="/facts">
        <button>Facts</button>
      </Link>
      <h1>Hello!</h1> 
    </>
  )
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Hello />} />
          <Route path="/facts" element={<Facts />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;