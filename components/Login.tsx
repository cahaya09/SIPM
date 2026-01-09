
import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: Math.random().toString(),
      username,
      role,
      fullName: role === UserRole.ADMIN ? 'Chief Administrator' : 'District Officer'
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-8 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-500/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white text-slate-900 rounded-[2.5rem] shadow-2xl mb-8 ring-[12px] ring-white/5">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <h1 className="text-5xl font-serif text-white tracking-tight mb-2">SIPM PRO</h1>
          <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">Secure Gateway Access</p>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username Identifier</label>
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:bg-white focus:text-slate-900 focus:ring-4 focus:ring-white/10 outline-none transition-all placeholder:text-slate-700 font-bold"
                placeholder="system_admin"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Encrypted Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:bg-white focus:text-slate-900 focus:ring-4 focus:ring-white/10 outline-none transition-all placeholder:text-slate-700 font-bold"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Level</label>
              <div className="grid grid-cols-2 gap-4">
                {[UserRole.ADMIN, UserRole.STAFF].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${role === r ? 'bg-white border-white text-slate-900' : 'bg-transparent border-white/10 text-slate-500 hover:border-white/30 hover:text-white'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-white hover:bg-slate-200 text-slate-900 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center justify-center space-x-3 text-xs"
            >
              <span>Authorize Login</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </form>
          
          <div className="mt-12 text-center">
            <div className="flex items-center justify-center space-x-2">
              <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
              <p className="text-[9px] text-slate-600 uppercase tracking-[0.3em] font-black">Quantum-Level Encryption Enabled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
