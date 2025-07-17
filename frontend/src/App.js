// src/App.js (Revert to previous working version)
import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import SideNav from './components/SideNav';
import MainContent from './components/MainContent';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/index.css';

function App() {
  const [sidenavOpen, setSidenavOpen] = useState(true);

  const toggleSidenav = () => {
    setSidenavOpen(!sidenavOpen);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar toggleSidenav={toggleSidenav} sidenavOpen={sidenavOpen} />
        <div className="content-container">
          <SideNav isOpen={sidenavOpen} />
          <MainContent isSidenavOpen={sidenavOpen} />
        </div>
      </div>
    </Router>
  );
}

export default App;
