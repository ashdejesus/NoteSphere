import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AddNote from "./pages/AddNote"; // Import AddNote page
import "bootstrap/dist/css/bootstrap.min.css";

import About from "./pages/About"; // Import About page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-note" element={<AddNote />} />
        <Route path="/about" element={<About />} /> {/* New About route */}
      </Routes>
    </Router>
  );
}


export default App;
