import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ChefHat, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const performApiLogin = async (loginEmail: string, loginPassword: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await response.json();
      if (data.success) {
        login(data.user.email, data.user.role, data.token);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.error("Backend login failed, trying register fallback", err);
    }

    // Fallback: register the user in clean MongoDB database
    try {
      const role = loginEmail.toLowerCase() === 'admin@canteenly.com' ? 'admin' : 'student';
      const name = role === 'admin' ? 'Admin User' : 'Student User';
      const regResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: loginEmail, password: loginPassword, phone: '1234567890', role })
      });
      const regData = await regResponse.json();
      if (regData.success) {
        login(regData.user.email, regData.user.role, regData.token);
      } else {
        setError(regData.message || 'Authentication failed.');
      }
    } catch (err) {
      setError('Authentication failed. Server connection error.');
    }
    setIsLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    performApiLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0c0c0c]">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-light/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md z-10 px-6"
      >
        <div className="glass-card p-10 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-light to-brand transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
          
          <div className="flex flex-col items-center mb-10">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand to-brand-light flex items-center justify-center shadow-[0_0_30px_rgba(255,107,0,0.4)] mb-6">
              <ChefHat size={32} className="text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
            <p className="text-neutral-400 text-sm text-center">
              Login to access your CanteenLY account.<br/>
              <span className="text-[10px] text-brand uppercase tracking-widest mt-2 block">Admin: admin@canteenly.com / admin123</span>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@canteenly.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded bg-white/5 border-white/10 text-brand focus:ring-brand/50 focus:ring-offset-0 transition-all" />
                <span className="text-sm text-neutral-400 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm text-brand hover:text-brand-light transition-colors font-medium">Forgot password?</a>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className={cn(
                "w-full bg-brand hover:bg-brand-light text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-4",
                isLoading ? "opacity-80 cursor-not-allowed" : "shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)]"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-8">
            Don't have an account? <a href="#" className="text-white hover:text-brand font-medium transition-colors">Sign up</a>
          </p>

          <div className="mt-8 pt-8 border-t border-white/5 flex gap-4">
            <button 
              onClick={() => performApiLogin('admin@canteenly.com', 'admin123')}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
            >
              Admin
            </button>
            <button 
              onClick={() => performApiLogin('user@canteenly.com', 'user123')}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
            >
              User
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
