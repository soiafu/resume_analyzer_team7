import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Login, Register } from './login'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/"
            element={
              <div >
                <div><Login /></div>
                <div><Register /></div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
