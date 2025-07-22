import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../contexts/useAuth";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(email, password);
      console.log(res)
      if (res.data.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      toast.error(err.response?.data.message)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent font-inter">
      <div className="w-full max-w-md p-8 space-y-6 rounded-2xl shadow-[0_4px_24px_0_rgba(99,102,241,0.08)] border border-[#30363D] bg-[#161B22]/80 backdrop-blur-md">
        <h2 className="text-3xl font-extrabold text-center text-[#F2F3F5] font-grotesk">Login</h2>
        {error && <div className="text-[#EF4444] text-sm text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full px-4 py-2 bg-[#6366F1] text-[#F2F3F5] rounded-lg font-semibold hover:bg-[#4F46E5] transition-colors font-inter disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            Login
          </button>
        </form>
        <div className="flex justify-between text-sm">
          <Link to="/register" className="text-[#6366F1] hover:underline font-medium">Register</Link>
          <Link to="/forgot-password" className="text-[#6366F1] hover:underline font-medium">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 