import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from "react-redux";


import "./css/theme.css";
import "./css/base.css";
import "./App.css";
import { clearError, setLoading, setError, setUser, logout } from "./redux/slices/authSlice";
import axios from "axios";
import ResetPassword from "./components/auth/ResetPassword";


import ErrorBoundary from "./components/common/ErrorBoundary";
import { Toaster } from 'react-hot-toast';

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedToken = token || localStorage.getItem("token");
    if (!storedToken || user) return;

    const fetchUser = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        dispatch(setUser({ user: res.data, token: storedToken }));
      } catch (error) {
        console.error("Error fetching user data GET ME FAILED: ", error);
        dispatch(logout());
        dispatch(setError(error.response?.data?.message || "Failed to fetch user data/ Session Expired, please login again."));
      }
      finally {
        dispatch(setLoading(false));
      }
    };
    fetchUser();
  }, [dispatch, token, user]);

  return (
    <ErrorBoundary>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Homepage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
