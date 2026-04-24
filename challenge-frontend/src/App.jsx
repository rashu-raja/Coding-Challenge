import { useEffect, useState } from "react";
import Layout from "./Layouts/Layout";
import Welcome from "./Pages/Welcome";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Users from "./Pages/Users";
import { useAuth } from "./Context/useAuth";
import Register from "./Pages/Auth/Register";
import UserProfile from "./Pages/UserProfile";
import ProtectedRoute from "./Components/ProtectedRoute";
import Favorites from "./Pages/Favorites";
import Login from "./Pages/Auth/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route
              path="/"
              element={
                <Welcome>
                  <Login />
                </Welcome>
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* protected routes */}
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/:id/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default App;
