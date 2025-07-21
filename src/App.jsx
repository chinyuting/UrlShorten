import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UrlShorten from "./page/UrlShorten";
import RedirectPage from "./page/RedirectPage";
import NotFound from "./page/NotFound";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UrlShorten />} />
        <Route path="/:code" element={<RedirectPage />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={2000} />
    </BrowserRouter>
  );
}

export default App;
