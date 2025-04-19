import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-1/4 bg-blue-900 text-white p-6">
          <h2 className="text-2xl font-bold mb-6"> Social Media Application </h2>

          {!isLoggedIn ? (
            <div className="space-y-4">
              <Link to="/register">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
                  Register
                </button>
              </Link>
              <Link to="/login">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">
                  Login
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <Link to="/">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                  Home
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="w-3/4 p-6">
          <Routes>
            <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
            <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
