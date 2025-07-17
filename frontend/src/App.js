// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SideNav from './components/SideNav';
import Home from './pages/Home';
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
      <div className="app-container d-flex flex-column vh-100">
        <Navbar toggleSidenav={toggleSidenav} sidenavOpen={sidenavOpen} />
        <div className="d-flex flex-grow-1 overflow-hidden">
          <SideNav isOpen={sidenavOpen} />
          <main className={`content-area flex-grow-1 overflow-auto`}>
            <div className="container-fluid p-3">
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
