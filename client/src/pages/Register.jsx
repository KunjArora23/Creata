import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../contexts/useAuth";
import OTPModal from "../components/OTPModal";
import api from "../services/api";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register({ name, email, password });
      setOtpOpen(true);
      toast.success("Registration successful! Please verify OTP sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const handleVerifyOtp = async (otp) => {
    setOtpLoading(true);
    setOtpError("");
    try {
      await api.post("/api/auth/verify-otp", { email, otp });
      toast.success("Email verified! You can now login.");
      setOtpOpen(false);
      navigate("/login");
    } catch (err) {
      setOtpError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpLoading(true);
    setOtpError("");
    try {
      await api.post("/api/auth/resend-otp", { email });
      toast.success("OTP resent to your email.");
    } catch (err) {
      setOtpError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent font-inter">
      <div className="w-full max-w-md p-8 space-y-6 rounded-2xl shadow-[0_4px_24px_0_rgba(99,102,241,0.08)] border border-[#30363D] bg-[#161B22]/80 backdrop-blur-md">
        <h2 className="text-3xl font-extrabold text-center text-[#F2F3F5] font-grotesk">Register</h2>
        {error && <div className="text-[#EF4444] text-sm text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full px-3 py-2 rounded-lg border border-[#30363D] bg-[#0D1117] text-[#F2F3F5] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#6366F1] font-inter"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 rounded-lg border border-[#30363D] bg-[#0D1117] text-[#F2F3F5] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#6366F1] font-inter"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 rounded-lg border border-[#30363D] bg-[#0D1117] text-[#F2F3F5] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#6366F1] font-inter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={otpLoading}
            className="w-full px-4 py-2 bg-[#6366F1] text-[#F2F3F5] rounded-lg font-semibold hover:bg-[#4F46E5] transition-colors font-inter disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            Register
          </button>
        </form>
        <div className="text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-[#6366F1] hover:underline font-medium">Login</Link>
        </div>
      </div>
      <OTPModal
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        loading={otpLoading}
        error={otpError}
        email={email}
      />
    </div>
  );
};

export default Register; 