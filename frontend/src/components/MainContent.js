// src/components/MainContent.js
import React from 'react';
import Home from '../pages/Home';

const MainContent = ({ isSidenavOpen }) => {
  return (
    <main className={`main-content ${isSidenavOpen ? 'sidenav-open' : ''}`}>
      <div className="container-fluid p-4">
        <Home />
      </div>
    </main>
  );
};

export default MainContent;
