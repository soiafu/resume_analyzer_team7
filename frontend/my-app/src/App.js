import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import './App.css';
import { Login, Register } from './login'; 
import {Dashboard, PrivateRoute} from './dashboard/Dashboard';
import 'react-circular-progressbar/dist/styles.css';

function App() {
  let fitScore = 0;
  let matchedSkills = [];
  let suggestions = [];
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login"
            element={
              <div >
                <div><Login /></div>
                <div><Register /></div>
              </div>
            }
          />

          <Route path="/dashboard"
            element={
                <PrivateRoute>
                  <Dashboard
                  fitScore={fitScore}
                  matchedSkills={matchedSkills}
                  suggestions={suggestions}
                  />
                </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
export default App;