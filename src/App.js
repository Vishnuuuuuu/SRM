
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Admin from './components/Admin';
import DailyUpdate from './components/DailyUpdate';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import UploadFile from './components/UploadFile';
import View from './components/ViewFiles';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<DailyUpdate />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/upload-file" element={<UploadFile />} />
        <Route path="/Files" element={<View />} />
      </Routes>
    </Router>
  );
}

export default App;
