import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import SpinPage from "./SpinPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirect to SpinPage */}
        <Route path="/" element={<Navigate to="/spinpage" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/spinpage" element={<SpinPage />} />
      </Routes>
    </Router>
  );
}

export default App;