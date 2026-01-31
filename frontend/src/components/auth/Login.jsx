import React from 'react'
import { useState } from 'react'
import Input from '../common/Input'
import { useSelector, useDispatch } from 'react-redux'
import { clearError, setError, setLoading } from "../../redux/slices/authSlice";
import validator from 'validator'
import axios from 'axios'
import { setUser } from "../../redux/slices/authSlice";
import { closeAuthModal, switchAuthMode } from '../../redux/slices/uiSlice';
import '../../css/auth/Login.css'
// import '../../css/auth/Login.css'
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Forget Password
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotMsg, setForgotMsg] = useState("");



    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth)

    const { authMode } = useSelector((state) => state.ui);
    const isForgot = authMode === "forgot";

    const handleLogin = async (e) => {
        e.preventDefault();
        //login logic here
        dispatch(clearError());

        if (!validator.isEmail(email)) {
            //proceed
            dispatch(setError("Please enter a valid email address"));
            return;
        }
        if (!password) {
            dispatch(setError("Please enter your password"));
            return;
        }

        dispatch(setLoading(true));
        //api call
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
                {
                    email,
                    password,
                }
            );

            const data = res.data || {};

            dispatch(
                setUser({
                    user: data.user,
                    token: data.token
                })
            );

            localStorage.setItem("token", data.token);
            dispatch(closeAuthModal());
            console.log("Login Successful!");
        } catch (error) {
            const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
            dispatch(setError(serverMessage || "Login failed. Please try again later."));

        }
        //on success
        dispatch(setLoading(false));
        //on

    };

    const handleForgotPassword = async () => {
        //forgot password logic here
        if (!forgotEmail) {
            setForgotMsg("Please enter your email address");
            return;
        }
        try {
            setForgotMsg("Sending password reset link...");
            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/auth/forgot-password`,
                {
                    email: forgotEmail,
                }
            );
            setForgotMsg("Password reset link sent! Please check your email 📩 inbox.");
        } catch (error) {
            setForgotMsg(error?.response?.data?.message || "Failed to send password reset link. Please try again later.");
        }

    }

    return (
        <div className='login-wrapper'>
            <h3 className='login-title'>Welcome back!</h3>
            <p className='login-subtitle'>Please login to your account.</p>

            <form className='login-form' onSubmit={handleLogin}>
                
                    {!isForgot && (
                        <>
                            <Input value={email} onChange={(e) => { setEmail(e.target.value); }}
                                label={"Email Address"} placeholder={"johnwick@email.com"} type={"email"}
                            />

                            <Input value={password} onChange={(e) => { setPassword(e.target.value); }}
                                label="Password" placeholder={"Enter your password min 8 characters"} type="password"
                            />
                        </>
                    )}
                    {/* forgot password link */}
                    <div className='forgot-wrapper'>
                        {!isForgot ? (
                            <>
                                <span className='forgot-link' onClick={() => {
                                    dispatch(clearError());
                                    dispatch(switchAuthMode("forgot"));

                                }}>Forgot Password?</span>

                                <span>Don't have an account? <span className='forgot-link' onClick={() => {
                                    dispatch(clearError());
                                    dispatch(switchAuthMode("signup"));
                                }}>Sign Up</span></span>
                            </>
                        ) : (
                            <div className="forgot-box">
                                <Input label="Email" type="email" placeholder="Enter your registered email" value={forgotEmail} onChange={(e) => { setForgotEmail(e.target.value); }} />
                                {forgotMsg && <p className='forgot-msg'>{forgotMsg}</p>}

                               <button type='button' className='forgot-btn' onClick={handleForgotPassword}>Send Reset Link</button>
                                
                                
                            </div>

                        )}
                    </div>

                    {error && <div className='login-error'>{error}</div>}
                    {!isForgot && (<button type='submit' className='login-submit-btn' disabled={isLoading} ><span>{isLoading ? "Logging in..." : "Login"}</span></button>)}
               
            </form>
        </div>
    )
}

export default Login