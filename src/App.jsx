import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AddNote from "./pages/AddNote"; 
import About from "./pages/About"; 
import Help from "./pages/Help"; // Import Help page
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-note" element={<AddNote />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} /> {/* New Help route */}
      </Routes>
    </Router>
  );
}

export default App;
