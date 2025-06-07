import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Properties from './Properties';

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`block p-2 rounded transition-colors ${
        isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Mobile menu button */}
        <button
          className="md:hidden fixed top-4 left-4 z-20 p-2 rounded bg-gray-800 text-white"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <span className="sr-only">Open menu</span>
          ☰
        </button>

        {/* Sidebar */}
        <nav className={`
          w-64 bg-gray-800 text-white fixed h-full z-10 transition-transform duration-300
          md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-8">LighthouseHQ</h1>
            <ul className="space-y-4">
              <li>
                <NavLink to="/dashboard">Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/properties">Properties</NavLink>
              </li>
              <li>
                <NavLink to="/property-details">Property Details</NavLink>
              </li>
              <li>
                <NavLink to="/reports">Reports</NavLink>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8 md:ml-64">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/property-details" element={<PropertyDetails />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

function Dashboard() {
  return <h1 className="text-3xl font-bold text-center">Welcome to LighthouseHQ 🚀 Updated!</h1>;
}

function PropertyDetails() {
  return <h1 className="text-3xl font-bold text-center">Property Details</h1>;
}

function Reports() {
  return <h1 className="text-3xl font-bold text-center">Reports</h1>;
}

export default App;