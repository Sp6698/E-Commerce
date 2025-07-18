// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SideNav from './components/SideNav';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddProduct from './components/AddProduct';

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
          {sidenavOpen && (
            <SideNav isOpen={sidenavOpen} />
          )}
          <main className={`content-area flex-grow-1 overflow-auto`}>
            <div className="container-fluid">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/add-product" element={<AddProduct />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>

      {/* ToastContainer added here */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover />
    </Router>
  );
}

export default App;
