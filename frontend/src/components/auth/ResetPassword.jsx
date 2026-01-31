import React,{useState} from 'react'
import axios from 'axios'
import '../../css/auth/ResetPassword.css'
import Input from '../common/Input'
import { useNavigate, useParams } from 'react-router-dom'

const ResetPassword = () => {

const {token} = useParams();
const [password, setPassword] = useState("");
const [status, setStatus] = useState("");//success,error
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);
const navigate = useNavigate();

const handleReset = async()=>{
    if(!password || password.length <8){
        setStatus("Error");
        setMessage("Password must be at least 8 characters long.");
        return;
    }

    try {
        setLoading(true);
        setStatus("info");
        setMessage("Resetting password...");
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/reset-password/${token}`,{
            password,  
        });
        setStatus("Success");
        setMessage("Password has been reset successfully. Redirecting....");
        setTimeout(()=>{
            navigate("/");
        },2000);
        setLoading(false);
    } catch (error) {
        setStatus("Error");
        setMessage(error?.response?.data?.message || "Failed to reset password. Please try again.");
        setLoading(false);
    } finally{
        setLoading(false);
    }
}

  return (
    <div className='reset-wrapper'>
        <h3 className="reset-title">ResetPassword</h3>
        <p className="reset-subtitle">Enter your new password to regain access.</p>

        <div className="reset-form">
            <Input label="New Password" type="password" value={password} onChange={(e)=> setPassword(e.target.value)} placeholder="Enter your new password" />
            {status == "Error" && <div className='reset-error'>{message}</div> }
            {status == "Success" && <div className='reset-success'>{message}</div> }
            
            <button className='reset-submit-btn' onClick={handleReset} disabled={loading}>
                <span>{loading ? "Resetting..." : "Reset Password"}</span>
            </button>
        </div>
    </div>
  )
}

export default ResetPassword