import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Login, Register } from './login'; 
import {Upload, Description, Dashboard} from './dashboard/Dashboard';
import 'react-circular-progressbar/dist/styles.css';

function App() {
  const fitScore = 60;
  const matchedSkills = ['Python', 'Java', 'Javascript', 'React.js'];
  const suggestions = [
    'Suggestion 1',
    'Suggestion 2',
    'Suggestion 3'
  ];
  
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

          <Route path="/dashboard"
            element={
              <div>
                <div><Upload /></div>
                <div><Description /></div>
                <div>
                  <Dashboard
                  fitScore={fitScore}
                  matchedSkills={matchedSkills}
                  suggestions={suggestions}
                />
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
export default App;