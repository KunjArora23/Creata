import React, { useState } from "react";

const OTPModal = ({ open, onClose, onVerify, onResend, loading, error, email }) => {
  const [otp, setOtp] = useState("");

  if (!open) return null;

  const handleVerify = (e) => {
    e.preventDefault();
    onVerify(otp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl shadow-lg p-8 w-full max-w-sm font-inter relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-[#AAB1B8] hover:text-[#F2F3F5] text-xl font-bold cursor-pointer">&times;</button>
        <h2 className="text-2xl font-extrabold text-center mb-2 text-[#F2F3F5] font-grotesk">Verify OTP</h2>
        <p className="text-[#AAB1B8] text-center mb-4 text-sm">Enter the 6-digit code sent to <span className="text-[#6366F1]">{email}</span></p>
        {error && <div className="text-[#EF4444] text-center text-sm mb-2">{error}</div>}
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            pattern="[0-9]{6}"
            inputMode="numeric"
            autoFocus
            className="w-full px-4 py-2 rounded-lg border border-[#30363D] bg-[#0D1117] text-[#F2F3F5] text-center text-xl tracking-widest font-mono placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            placeholder="------"
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
            required
          />
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-2 rounded-lg font-semibold text-[#F2F3F5] bg-[#6366F1] hover:bg-[#4F46E5] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            onClick={onResend}
            disabled={loading}
            className="text-[#6366F1] hover:underline font-medium disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal; 