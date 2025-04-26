import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Messenger from "./pages/Messenger";
import Login from "./pages/Login";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/messenger" element={<Messenger />} />
        <Route path="/messenger/:id" element={<Messenger />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
