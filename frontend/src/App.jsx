import React from 'react';
import './App.css';

import PublicNavbar from './components/layout/PublicNavbar';
import PublicFooter from './components/layout/PublicFooter';
import HomePage from './features/landing/pages/HomePage';

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        <HomePage />
      </main>

      <PublicFooter />
    </div>
  );
}

export default App;