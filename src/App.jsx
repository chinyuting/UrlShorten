import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UrlShorten from "./page/UrlShorten";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UrlShorten />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={2000} />
    </BrowserRouter>
  );
}

export default App;
