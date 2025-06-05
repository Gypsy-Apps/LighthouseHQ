import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <nav className="w-64 bg-gray-800 text-white fixed h-full">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-8">LighthouseHQ</h1>
            <ul className="space-y-4">
              <li>
                <Link to="/dashboard" className="block hover:bg-gray-700 p-2 rounded">Dashboard</Link>
              </li>
              <li>
                <Link to="/properties" className="block hover:bg-gray-700 p-2 rounded">Properties</Link>
              </li>
              <li>
                <Link to="/property-details" className="block hover:bg-gray-700 p-2 rounded">Property Details</Link>
              </li>
              <li>
                <Link to="/reports" className="block hover:bg-gray-700 p-2 rounded">Reports</Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property-details" element={<PropertyDetails />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Dashboard() {
  return <h1 className="text-3xl font-bold text-center">Dashboard</h1>;
}

function Properties() {
  return <h1 className="text-3xl font-bold text-center">Properties</h1>;
}

function PropertyDetails() {
  return <h1 className="text-3xl font-bold text-center">Property Details</h1>;
}

function Reports() {
  return <h1 className="text-3xl font-bold text-center">Reports</h1>;
}

export default App;