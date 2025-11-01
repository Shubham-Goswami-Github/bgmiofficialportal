import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import SpinPage from "./SpinPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/spinpage" element={<SpinPage />} />
      </Routes>
    </Router>
  );
}

export default App;