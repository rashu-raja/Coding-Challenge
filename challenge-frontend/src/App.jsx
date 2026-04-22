import { useState } from "react";
import "./App.css";
import Layout from "./Layouts/Layout";
import Welcome from "./Pages/Welcome";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Users from "./Pages/Users";
import Navbar from "./Components/Navbar";

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default App;
