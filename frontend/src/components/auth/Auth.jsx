import React from "react";
import "../../css/auth/Auth.css";
import { useDispatch, useSelector } from 'react-redux';
import { clearError } from "../../redux/slices/authSlice.js";
import { closeAuthModal } from "../../redux/slices/uiSlice";
import Modal from "../common/Modal";
import Signup from "./Signup";
import Login from "./Login";

const Auth = () => {
  const dispatch = useDispatch();
  const { authModalOpen, authMode } = useSelector((state) => state.ui);

  // This component now only handles rendering the Auth Modals.
  // The Login/Signup/Logout buttons have been moved to TopNav.jsx.

  if (!authModalOpen) return null;

  return (
    <>
      {authModalOpen && (
        <Modal onClose={() => {
          dispatch(closeAuthModal());
          dispatch(clearError());
        }}>
          {authMode === "signup" && <Signup />}
          {(authMode === "login" || authMode === "forgot") && <Login />}
        </Modal>
      )}
    </>
  );
};

export default Auth;
