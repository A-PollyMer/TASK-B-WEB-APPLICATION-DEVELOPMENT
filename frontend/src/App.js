import React, { useContext } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/Authentication";

// Pages
import Homepage from "./pages/Homepage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import UserManagement from './pages/UserManagement';
import PostManagement from './pages/PostManagement';

import "bootstrap/dist/css/bootstrap.min.css";

/*
  NavBar Component - Shows different links based on auth state
*/
function NavBar() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.href = "/"; // Redirect to home after logout
  };

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">BlogSite</Link>

      <div className="navbar-nav me-auto">
        <Link className="nav-link" to="/">Home</Link>
        
        {/* Show these only if NOT logged in */}
        {!user && (
          <>
            <Link className="nav-link" to="/register">Register</Link>
            <Link className="nav-link" to="/login">Login</Link>
          </>
        )}

        {/* Show these only if logged in */}
        {user && (
          <>
            <Link className="nav-link" to="/admin">Admin</Link>
          </>
        )}
      </div>

      {/* Right side - User info and logout */}
      {user && (
        <div className="navbar-nav ms-auto">
          <span className="navbar-text text-white me-3">
            👤 {user.username}
          </span>
          <button 
            className="btn btn-outline-light btn-sm" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <div>
        {/* Navigation Bar with conditional rendering */}
        <NavBar />

        {/* Page Container */}
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/posts" element={<PostManagement />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;