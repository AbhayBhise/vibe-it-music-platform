import React, { useState } from 'react'
import Input from '../common/Input'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { clearError, setError, setLoading, setUser } from '../../redux/slices/authSlice.js'
import {CiUser} from 'react-icons/ci'
import '../../css/auth/Signup.css'
import { switchAuthMode,closeAuthModal } from '../../redux/slices/uiSlice'
const Signup = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth)

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

// Avatar states:

  const[previewImage, setPreviewImage] = useState("");
  const[base64Image, setBase64Image] = useState("");


  const handleImageChange = (e) => {
    const file = e.target.files[0]; 

    if (!file) return;

    
    const reader = new FileReader();
    reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setBase64Image(reader.result);
      };
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Signup logic here
    dispatch(clearError());
    if(!fullName || !email || !password){
      dispatch(setError("All fields are required."));
      return;
    };
  
    dispatch(setLoading(true));
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/signup`, {
        name: fullName,
        email,
        password,
        avatar: base64Image ? base64Image : undefined,
      });
      const data = res.data || {};
      dispatch(setUser({
        user: data.user,
        token: data.token
      }));
      localStorage.setItem("token", data.token);
      dispatch(closeAuthModal());
      console.log("Signup Successful!");
    } catch (error) {
      const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
      dispatch(setError(serverMessage || "Signup failed. Please try again."));
    }
  } 

  return (
    <div className='signup-wrapper'>
      <h3 className='signup-title'>Create an Account</h3>

      <p className="signup-subtitle">Join us today and start your musical journey!</p>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div>
          <div className="profile-image-container">
            {previewImage ? (
              <img src={previewImage} alt="Profile Preview" className="profile-image" />
            ) : (
              <div className="profile-placeholder"><CiUser size={40} /></div>
            )}
            <label className='image-upload-icon'>📸 <input type='file' accept='image/*' hidden onChange={handleImageChange}/> </label>
          </div>
          <Input label={"Name"} value={fullName} type={"text"} placeholder={"John Wick"} onChange={(e) => setFullName(e.target.value)} />

          <Input label={"Email Address"} value={email} type={"email"} placeholder={"Enter your email"} onChange={(e) => setEmail(e.target.value)} />

          <Input label={"Password"} value={password} type={"password"} placeholder={"Enter your password"} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <span className='forgot-link' onClick={()=>{
          dispatch(clearError());
          dispatch(switchAuthMode("login"));
        }} >Do you already have an account? <a href="/login">Login</a></span>

        {error && <div className='signup-error'>{error}</div>}

        <div className="signup-actions">
          <button 
          type='submit' 
          className='signup-btn-submit' 
          disabled={isLoading} >
            <span>{isLoading ? "Signing up..." : "Sign Up"}</span>
          </button>

        </div>
      </form>
    </div>
  )
}

export default Signup