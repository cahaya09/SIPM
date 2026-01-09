
import React, { useState, useEffect } from 'react';
import { User, Resident, UserRole } from './types';
import { dbService } from './db';
import Login from './Login';
import Dashboard from './Dashboard';
import ResidentTable from './ResidentTable';
import ResidentForm from './ResidentForm';
import Reports from './Reports';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'residents' | 'reports'>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | undefined>(undefined);

  useEffect(() => {
    if (currentUser) {
      setResidents(dbService.getResidents());
    }
  }, [currentUser]);

  const handleAddResident = (data: Omit<Resident, 'id' | 'createdAt'>) => {
    try {
      if (editingResident) {
        dbService.updateResident(editingResident.id, data);
      } else {
        dbService.addResident(data);
      }
      setResidents(dbService.getResidents());
      setEditingResident(undefined);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteResident = (id: string) => {
    if (confirm('Konfirmasi penghapusan data secara permanen?')) {
      dbService.deleteResident(id);
      setResidents(dbService.getResidents());
    }
  };

  const openEditForm = (resident: Resident) => {
    setEditingResident(resident);
    setIsFormOpen(true);
  };

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex selection:bg-slate-900 selection:text-white">
      {/* Premium Sidebar Navigation */}
      <aside className="hidden lg:flex w-80 bg-[#0f172a] flex-col shadow-2xl z-50 fixed h-full border-r border-white/5">
        <div className="p-12 border-b border-white/5">
          <div className="flex items-center space-x-5">
            <div className="w-14 h-14 bg-white rounded-[1.5rem] flex items-center justify-center text-slate-900 shadow-2xl ring-8 ring-white/5">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <div>
              <span className="text-3xl font-black text-white tracking-tighter block leading-none">SIPM PRO</span>
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mt-2 block opacity-60">Village Management</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-8 py-12 space-y-4">
          {[
            { id: 'dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', label: 'Dashboard' },
            { id: 'residents', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', label: 'Data Penduduk' },
            { id: 'reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Laporan Digital' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center space-x-5 px-8 py-5 rounded-2xl transition-all group ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-2xl shadow-white/5 font-black' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`}
            >
              <svg className={`w-6 h-6 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tab.icon}/></svg>
              <span className="text-sm tracking-tight font-bold">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-10">
          <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5">
            <div className="flex items-center space-x-5 mb-8">
              <div className="w-14 h-14 bg-slate-800 rounded-2xl overflow-hidden ring-2 ring-white/10">
                 <img src={`https://picsum.photos/seed/${currentUser.username}/200/200`} alt="Staff" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-black text-white truncate leading-none">{currentUser.fullName}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">{currentUser.role}</p>
              </div>
            </div>
            <button 
              onClick={() => confirm('Keluar dari sistem?') && setCurrentUser(null)}
              className="w-full flex items-center justify-center space-x-3 py-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-red-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              <span>Logout Akun</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Content Wrapper */}
      <main className="flex-1 lg:ml-80 overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-3xl sticky top-0 z-40 px-12 py-8 flex items-center justify-between border-b border-slate-200/50 shadow-sm">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
              {activeTab === 'dashboard' ? 'Insight Data Overview' : 
               activeTab === 'residents' ? 'Registry Kependudukan' : 'Strategic Analytics'}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Module Active: {activeTab.toUpperCase()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
             {activeTab === 'residents' && (
                <button
                  onClick={() => {
                    setEditingResident(undefined);
                    setIsFormOpen(true);
                  }}
                  className="bg-[#0f172a] hover:bg-slate-800 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-900/10 transition-all flex items-center space-x-3 active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                  <span>Tambah Data</span>
                </button>
             )}
          </div>
        </header>

        <div className="p-12 pb-32">
          {activeTab === 'dashboard' && <Dashboard residents={residents} />}
          {activeTab === 'residents' && (
            <ResidentTable 
              residents={residents} 
              onEdit={openEditForm} 
              onDelete={handleDeleteResident}
              userRole={currentUser.role}
            />
          )}
          {activeTab === 'reports' && <Reports residents={residents} />}
        </div>
      </main>

      <ResidentForm 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingResident(undefined); }} 
        onSubmit={handleAddResident} 
        initialData={editingResident} 
      />
    </div>
  );
};

export default App;
