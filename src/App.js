import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Admin from './components/Admin';
import DailyUpdate from './components/DailyUpdate';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<DailyUpdate />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
