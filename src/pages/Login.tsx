import React, { useEffect } from 'react';
import { useAuthViewModel } from '@/src/modules/auth/viewmodels/useAuthViewModel.ts';
import { Button } from '@/src/components/Button.tsx';
import { LogIn, Lock, User as UserIcon } from 'lucide-react';
import { Logo } from '@/src/components/Logo.tsx';
import { useAuth } from '@/src/context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/src/services/authService.ts';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    executeLogin,
  } = useAuthViewModel();

  // Forgot Password / Reset Password Local States
  const [mode, setMode] = React.useState<'LOGIN' | 'FORGOT_OTP' | 'RESET_PASS'>('LOGIN');
  const [forgotEmail, setForgotEmail] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [actionLoading, setActionLoading] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      // Simulate API call for demonstration/testing on Frontend
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setActionSuccess('Verification OTP sent successfully to your email address (Simulated).');
      setMode('RESET_PASS');
    } catch (err: any) {
      setActionError(err.message || 'Failed to dispatch OTP. Please verify email and try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setActionError('Security Tokens (Passwords) do not match.');
      return;
    }
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      // Simulate API call for demonstration/testing on Frontend
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setActionSuccess('Security Token updated successfully (Simulated). Please log in.');
      setMode('LOGIN');
      // Clear forms
      setForgotEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setActionError(err.message || 'Verification failure. Please review OTP code.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-10 font-sans relative overflow-hidden">
      {/* Abstract Background Design */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-50 bg-gradient-to-br from-blue-100 to-transparent rounded-full blur-3xl opacity-50 select-none pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-50 bg-gradient-to-tr from-rose-100 to-transparent rounded-full blur-3xl opacity-30 select-none pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border-4 border-white p-6 sm:p-8 relative z-10 transition-all hover:translate-y-[-2px]">
        <div className="text-center mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 border-slate-50 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-xl shadow-slate-100 transition-transform hover:scale-105 duration-500 overflow-hidden">
            <Logo className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-blue-900 tracking-tight leading-tight uppercase font-sans">
            Dascon Sourav Commercial<br/>Private Limited
          </h2>
          <p className="text-rose-600 font-black uppercase tracking-[0.2em] text-[7px] sm:text-[9px] mt-2 italic leading-relaxed">Engineers and Contractors</p>
        </div>

        {(error || actionError) && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-rose-50 border-l-4 border-rose-500 rounded-xl animate-in fade-in slide-in-from-top-1 text-left">
            <p className="text-[8px] sm:text-[9px] font-black text-rose-600 uppercase tracking-widest leading-relaxed">
              {error || actionError}
            </p>
          </div>
        )}

        {actionSuccess && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-xl animate-in fade-in slide-in-from-top-1 text-left">
            <p className="text-[8px] sm:text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-relaxed">
              {actionSuccess}
            </p>
          </div>
        )}

        {mode === 'LOGIN' && (
          <form onSubmit={executeLogin} className="space-y-3 sm:space-y-4">
            <div className="space-y-2 sm:space-y-3 text-left">
              <div className="space-y-1">
                <label htmlFor="identity-credentials" className="block text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Identity Credentials</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="identity-credentials"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-[1rem] sm:rounded-[1.2rem] py-3 sm:py-4 pl-14 pr-6 outline-none focus:border-blue-500 transition-all font-black text-slate-800 placeholder:text-slate-455 shadow-inner text-xs"
                    placeholder="ID or Email"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="security-token" className="block text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Security Token</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                       <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="security-token"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-[1rem] sm:rounded-[1.2rem] py-3 sm:py-4 pl-14 pr-6 outline-none focus:border-blue-500 transition-all font-black text-slate-800 placeholder:text-slate-455 shadow-inner text-xs"
                    placeholder="••••••••"
                  />
                </div>
                <div className="text-right px-2 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('FORGOT_OTP');
                      setActionError(null);
                      setActionSuccess(null);
                    }}
                    className="text-[8px] sm:text-[9px] font-black text-rose-600 hover:text-rose-500 uppercase tracking-[0.1em] italic cursor-pointer focus:outline-none"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full py-4 sm:py-5 text-base sm:text-lg rounded-[1rem] sm:rounded-[1.2rem] shadow-xl shadow-blue-100 font-black tracking-wide italic hover:scale-[1.01] active:scale-[0.99] transition-all bg-slate-900 border-none" loading={loading}>
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
              SECURE ACCESS
            </Button>
          </form>
        )}

        {mode === 'FORGOT_OTP' && (
          <form onSubmit={handleRequestOtp} className="space-y-3 sm:space-y-4">
            <div className="space-y-2 sm:space-y-3 text-left">
              <div className="space-y-1">
                <label htmlFor="forgot-email" className="block text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Registered Email Address</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-[1rem] sm:rounded-[1.2rem] py-3 sm:py-4 pl-14 pr-6 outline-none focus:border-blue-500 transition-all font-black text-slate-800 placeholder:text-slate-455 shadow-inner text-xs"
                    placeholder="Enter registered email"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full py-4 sm:py-5 text-base sm:text-lg rounded-[1rem] sm:rounded-[1.2rem] shadow-xl shadow-blue-100 font-black tracking-wide italic hover:scale-[1.01] active:scale-[0.99] transition-all bg-slate-900 border-none animate-in" loading={actionLoading}>
              SEND OTP CODE
            </Button>

            <button
              type="button"
              onClick={() => {
                setMode('LOGIN');
                setActionError(null);
                setActionSuccess(null);
              }}
              className="w-full text-center text-[9px] sm:text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest pt-2 cursor-pointer focus:outline-none"
            >
              Back to Login
            </button>
          </form>
        )}

        {mode === 'RESET_PASS' && (
          <form onSubmit={handleResetPassword} className="space-y-3 sm:space-y-4">
            <div className="space-y-2 sm:space-y-3 text-left">
              <div className="space-y-1">
                <label htmlFor="reset-email" className="block text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
                <input
                  id="reset-email"
                  type="email"
                  readOnly
                  value={forgotEmail}
                  className="w-full bg-slate-100 border-2 border-slate-100 rounded-[1rem] sm:rounded-[1.2rem] py-3 sm:py-4 px-6 outline-none font-black text-slate-500 text-xs shadow-inner cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="otp-code" className="block text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">OTP Verification Code</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="otp-code"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-[1rem] sm:rounded-[1.2rem] py-3 sm:py-4 pl-14 pr-6 outline-none focus:border-blue-500 transition-all font-black text-slate-800 placeholder:text-slate-455 shadow-inner text-xs"
                    placeholder="Enter 6-digit OTP"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="new-password" className="block text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">New Security Token (Password)</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                       <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="new-password"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-[1rem] sm:rounded-[1.2rem] py-3 sm:py-4 pl-14 pr-6 outline-none focus:border-blue-500 transition-all font-black text-slate-800 placeholder:text-slate-455 shadow-inner text-xs"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="confirm-password" className="block text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Confirm Security Token (Password)</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                       <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-[1rem] sm:rounded-[1.2rem] py-3 sm:py-4 pl-14 pr-6 outline-none focus:border-blue-500 transition-all font-black text-slate-800 placeholder:text-slate-455 shadow-inner text-xs"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full py-4 sm:py-5 text-base sm:text-lg rounded-[1rem] sm:rounded-[1.2rem] shadow-xl shadow-blue-100 font-black tracking-wide italic hover:scale-[1.01] active:scale-[0.99] transition-all bg-slate-900 border-none animate-in" loading={actionLoading}>
              RESET PASSWORD
            </Button>

            <button
              type="button"
              onClick={() => {
                setMode('FORGOT_OTP');
                setActionError(null);
                setActionSuccess(null);
              }}
              className="w-full text-center text-[9px] sm:text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest pt-2 cursor-pointer focus:outline-none"
            >
              Back to Request OTP
            </button>
          </form>
        )}

        <div className="mt-6 sm:mt-8 pt-4 border-t border-slate-50 text-center">
          <p className="text-[8px] sm:text-[9px] font-black text-slate-200 uppercase tracking-[0.4em] italic">
            AUTHORIZED PERSONNEL ONLY
          </p>
        </div>
      </div>
    </div>
  );
}
