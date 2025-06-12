import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Properties from './Properties';
import TasksPage from './pages/TasksPage';
import Auth from './components/Auth';

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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDevelopment = import.meta.env.DEV;

  useEffect(() => {
    // Check for development mock user first
    if (isDevelopment) {
      const mockUser = localStorage.getItem('dev-mock-user');
      if (mockUser) {
        setUser(JSON.parse(mockUser));
        setLoading(false);
        return;
      }
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [isDevelopment]);

  const handleSignOut = async () => {
    // Clear development mock user if it exists
    if (isDevelopment) {
      localStorage.removeItem('dev-mock-user');
    }
    
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleAuthSuccess = () => {
    // Auth state will be updated automatically by the listener or mock user check
    window.location.reload(); // Refresh to ensure proper state
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

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
                <NavLink to="/tasks">Tasks</NavLink>
              </li>
              <li>
                <NavLink to="/property-details">Property Details</NavLink>
              </li>
              <li>
                <NavLink to="/reports">Reports</NavLink>
              </li>
            </ul>
            
            {/* User info and sign out */}
            <div className="mt-8 pt-8 border-t border-gray-700">
              <div className="text-sm text-gray-300 mb-2">
                Signed in as:
              </div>
              <div className="text-sm font-medium mb-3 truncate">
                {user.email}
                {isDevelopment && user.id === 'dev-user-123' && (
                  <span className="block text-xs text-yellow-400 mt-1">
                    (Development Mode)
                  </span>
                )}
              </div>
              <button
                onClick={handleSignOut}
                className="w-full text-left p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors text-sm"
              >
                Sign out
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8 md:ml-64">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/tasks" element={<TasksPage />} />
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