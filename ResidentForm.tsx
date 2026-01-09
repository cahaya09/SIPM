
import React, { useState, useEffect } from 'react';
import { Resident, Gender, MaritalStatus, ResidentStatus } from './types';
import { dbService } from './db';

interface ResidentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Resident, 'id' | 'createdAt'>) => void;
  initialData?: Resident;
}

const ResidentForm: React.FC<ResidentFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Omit<Resident, 'id' | 'createdAt'>>({
    nik: '',
    name: '',
    gender: Gender.MALE,
    dob: '',
    address: '',
    rt: '',
    dusun: '',
    maritalStatus: MaritalStatus.SINGLE,
    occupation: '',
    status: ResidentStatus.ALIVE,
    deathCertificateImg: ''
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (initialData) {
      setFormData({
        nik: initialData.nik,
        name: initialData.name,
        gender: initialData.gender,
        dob: initialData.dob,
        address: initialData.address,
        rt: initialData.rt,
        dusun: initialData.dusun,
        maritalStatus: initialData.maritalStatus,
        occupation: initialData.occupation,
        status: initialData.status,
        deathCertificateImg: initialData.deathCertificateImg || ''
      });
    } else {
      setFormData({
        nik: '',
        name: '',
        gender: Gender.MALE,
        dob: '',
        address: '',
        rt: '',
        dusun: '',
        maritalStatus: MaritalStatus.SINGLE,
        occupation: '',
        status: ResidentStatus.ALIVE,
        deathCertificateImg: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, deathCertificateImg: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nik.length !== 16) {
      setError("NIK harus 16 digit.");
      return;
    }
    
    if (dbService.isNikExists(formData.nik, initialData?.id)) {
      setError("NIK ini sudah digunakan oleh penduduk lain.");
      return;
    }

    if (formData.status === ResidentStatus.DECEASED && !formData.deathCertificateImg) {
      setError("Bukti foto surat kematian wajib diunggah untuk status Meninggal.");
      return;
    }

    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-[#0f172a] px-10 py-8 flex justify-between items-center text-white">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">{initialData ? 'Ubah Record' : 'Entri Penduduk Baru'}</h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Village Registry Parungkamal</p>
          </div>
          <button onClick={onClose} className="hover:bg-slate-800 p-2 rounded-2xl transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 overflow-y-auto max-h-[75vh]">
          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-[1.5rem] flex items-center gap-4 text-red-700 text-sm font-bold">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NIK (PRIMARY KEY)</label>
              <input required type="text" name="nik" value={formData.nik} onChange={handleChange} maxLength={16} placeholder="16 Digit NIK" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-900/5 focus:bg-white outline-none transition-all font-mono font-bold" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Sesuai Identitas" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-900/5 focus:bg-white outline-none transition-all font-bold" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Keberadaan</label>
              <select name="status" value={formData.status} onChange={handleChange} className={`w-full px-6 py-4 border rounded-2xl focus:ring-4 focus:ring-slate-900/5 outline-none transition-all font-bold ${formData.status === ResidentStatus.ALIVE ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                {Object.values(ResidentStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Lahir</label>
              <input required type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">RT</label>
              <input required type="text" name="rt" value={formData.rt} onChange={handleChange} placeholder="001" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dusun</label>
              <input required type="text" name="dusun" value={formData.dusun} onChange={handleChange} placeholder="Nama Dusun" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Lengkap</label>
              <textarea required name="address" rows={2} value={formData.address} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold"></textarea>
            </div>

            {formData.status === ResidentStatus.DECEASED && (
              <div className="md:col-span-2 space-y-4 p-8 bg-slate-900 rounded-[2.5rem] text-white">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Bukti Surat Kematian (MANDATORY)</label>
                <input required={!formData.deathCertificateImg} type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-slate-400 file:mr-6 file:py-3 file:px-8 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-white file:text-slate-900 hover:file:bg-slate-200 cursor-pointer" />
                {formData.deathCertificateImg && (
                  <img src={formData.deathCertificateImg} alt="Preview" className="w-full h-40 object-cover rounded-2xl mt-4 ring-2 ring-white/10" />
                )}
              </div>
            )}
          </div>

          <div className="mt-12 flex gap-6 justify-end">
            <button type="button" onClick={onClose} className="px-10 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors">Discard</button>
            <button type="submit" className="px-12 py-4 bg-[#0f172a] hover:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95">Authorize & Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResidentForm;
