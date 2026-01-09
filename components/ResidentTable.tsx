
import React, { useState } from 'react';
import { Resident, UserRole, ResidentStatus } from '../types';

interface ResidentTableProps {
  residents: Resident[];
  onEdit: (resident: Resident) => void;
  onDelete: (id: string) => void;
  userRole?: UserRole;
}

const ResidentTable: React.FC<ResidentTableProps> = ({ residents, onEdit, onDelete, userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResidents = residents.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.nik.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden max-w-7xl mx-auto">
      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Registry Penduduk</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Village Database Access</p>
          </div>
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Cari NIK atau Nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 border border-slate-200 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-slate-800 outline-none transition-all placeholder:text-slate-300 font-medium"
            />
            <svg className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-100/50 text-slate-400 text-[10px] font-extrabold uppercase tracking-[0.2em] border-b border-slate-100">
            <tr>
              <th className="px-8 py-5">Individu</th>
              <th className="px-8 py-5">Wilayah (RT/Dusun)</th>
              <th className="px-8 py-5">Status Kehidupan</th>
              <th className="px-8 py-5">Pekerjaan</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredResidents.map((resident) => (
              <tr key={resident.id} className={`group hover:bg-slate-50 transition-colors ${resident.status === ResidentStatus.DECEASED ? 'opacity-70 bg-red-50/5' : ''}`}>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg ${resident.gender === 'Laki-laki' ? 'bg-slate-800' : 'bg-slate-400'}`}>
                      {resident.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-blue-900 transition-colors">{resident.name}</p>
                      <p className="font-mono text-[10px] text-slate-400 font-bold mt-1 tracking-widest">{resident.nik}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm text-slate-800 font-black">RT {resident.rt}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-1">{resident.dusun}</p>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${resident.status === ResidentStatus.ALIVE ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                    {resident.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm text-slate-500 font-semibold">
                  {resident.occupation}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(resident)} className="p-2.5 bg-white shadow-sm border border-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white rounded-xl transition-all" title="Edit">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                    </button>
                    {userRole === UserRole.ADMIN && (
                      <button onClick={() => confirm('Hapus data?') && onDelete(resident.id)} className="p-2.5 bg-white shadow-sm border border-slate-100 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResidentTable;
