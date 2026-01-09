
import React, { useState, useMemo } from 'react';
import { Resident, ResidentStatus } from '../types';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

interface ReportsProps {
  residents: Resident[];
}

type Period = 'harian' | 'mingguan' | 'bulanan' | 'tahunan';

const Reports: React.FC<ReportsProps> = ({ residents }) => {
  const [filterRT, setFilterRT] = useState('');
  const [filterDusun, setFilterDusun] = useState('');
  const [filterStatus, setFilterStatus] = useState<ResidentStatus | 'all'>('all');
  const [period, setPeriod] = useState<Period>('bulanan');
  const [dateFrom, setDateFrom] = useState('');

  const filteredData = useMemo(() => {
    return residents.filter(r => {
      const matchRT = filterRT ? r.rt.includes(filterRT) : true;
      const matchDusun = filterDusun ? r.dusun.toLowerCase().includes(filterDusun.toLowerCase()) : true;
      const matchStatus = filterStatus === 'all' ? true : r.status === filterStatus;
      
      let matchPeriod = true;
      if (dateFrom) {
        const createDate = new Date(r.createdAt);
        const refDate = new Date(dateFrom);
        
        if (period === 'harian') {
          matchPeriod = createDate.toDateString() === refDate.toDateString();
        } else if (period === 'tahunan') {
          matchPeriod = createDate.getFullYear() === refDate.getFullYear();
        } else if (period === 'bulanan') {
          matchPeriod = createDate.getMonth() === refDate.getMonth() && createDate.getFullYear() === refDate.getFullYear();
        }
        else if (period === 'mingguan') {
          const diff = (createDate.getTime() - refDate.getTime()) / (1000 * 3600 * 24);
          matchPeriod = diff >= 0 && diff <= 7;
        }
      }
      return matchRT && matchDusun && matchStatus && matchPeriod;
    });
  }, [residents, filterRT, filterDusun, filterStatus, period, dateFrom]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData.map(r => ({
      NIK: r.nik,
      Nama: r.name,
      Gender: r.gender,
      RT: r.rt,
      Dusun: r.dusun,
      Alamat: r.address,
      Status: r.status,
      Pekerjaan: r.occupation,
      'Tanggal Input': new Date(r.createdAt).toLocaleString('id-ID')
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data_Masyarakat");
    XLSX.writeFile(workbook, `SIPM_Report_${new Date().getTime()}.xlsx`);
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Header Section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("LAPORAN STRATEGIS KEPENDUDUKAN", 14, 25);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text(`DESA PARUNGKAMAL | PERIODE: ${period.toUpperCase()}`, 14, 32);
      doc.text(`TANGGAL CETAK: ${new Date().toLocaleString('id-ID')}`, 14, 37);
      
      // Divider
      doc.setDrawColor(226, 232, 240); // Slate-200
      doc.line(14, 42, 196, 42);
      
      // Table Headers
      let y = 52;
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59); // Slate-800
      doc.text("NIK", 14, y);
      doc.text("NAMA LENGKAP", 45, y);
      doc.text("RT/DUSUN", 100, y);
      doc.text("STATUS", 145, y);
      doc.text("TGL INPUT", 175, y);
      
      doc.line(14, y + 2, 196, y + 2);
      y += 10;
      
      // Table Content
      doc.setFont("helvetica", "normal");
      filteredData.forEach((r, index) => {
        if (y > 275) {
          doc.addPage();
          y = 20;
          // Re-add headers on new page if needed, but keeping it simple for now
        }
        doc.text(r.nik, 14, y);
        doc.text(r.name.substring(0, 24), 45, y);
        doc.text(`${r.rt}/${r.dusun.substring(0, 10)}`, 100, y);
        doc.text(r.status, 145, y);
        doc.text(new Date(r.createdAt).toLocaleDateString('id-ID'), 175, y);
        y += 8;
      });

      if (filteredData.length === 0) {
        doc.text("Tidak ada data tersedia untuk filter ini.", 14, y);
      }
      
      doc.save(`SIPM_Parungkamal_Report_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Gagal membuat PDF. Silakan coba lagi.");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-7xl mx-auto">
      <div className="bg-white p-12 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Ekspor & Analisis</h3>
            <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1">Management Information System</p>
          </div>
          <div className="flex gap-4">
            <button onClick={exportToExcel} className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-900 hover:border-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm flex items-center gap-3">
               <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/></svg>
               XLS EXPORT
            </button>
            <button onClick={exportToPDF} className="px-8 py-4 bg-[#0f172a] text-white hover:bg-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-900/10 transition-all flex items-center gap-3 active:scale-95">
               <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
               GENERATE PDF
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {[
            { label: 'Timeframe', child: (
              <select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-900/5 outline-none font-bold text-slate-700 appearance-none">
                <option value="harian">Harian</option><option value="mingguan">Mingguan</option><option value="bulanan">Bulanan</option><option value="tahunan">Tahunan</option>
              </select>
            )},
            { label: 'Reference Date', child: (
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-700" />
            )},
            { label: 'Sector (RT)', child: (
              <input type="text" placeholder="ID RT" value={filterRT} onChange={(e) => setFilterRT(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold placeholder:text-slate-300" />
            )},
            { label: 'Zone (Dusun)', child: (
              <input type="text" placeholder="Nama Dusun" value={filterDusun} onChange={(e) => setFilterDusun(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold placeholder:text-slate-300" />
            )},
            { label: 'Life Status', child: (
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold appearance-none">
                <option value="all">Semua Status</option><option value={ResidentStatus.ALIVE}>Hidup</option><option value={ResidentStatus.DECEASED}>Meninggal</option>
              </select>
            )}
          ].map((item, idx) => (
            <div key={idx} className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{item.label}</label>
              {item.child}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
          <div>
            <h4 className="font-black text-slate-900 tracking-tight">Preview Data Terpilih</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Found {filteredData.length} records matching criteria</p>
          </div>
          <span className="text-[10px] font-black bg-[#0f172a] text-white px-5 py-2 rounded-xl uppercase tracking-widest">Active Search</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-slate-400 uppercase text-[9px] font-black tracking-[0.2em] border-b border-slate-50">
              <tr>
                <th className="px-10 py-6">ID System (NIK)</th>
                <th className="px-10 py-6">Full Name</th>
                <th className="px-10 py-6">RT / Dusun</th>
                <th className="px-10 py-6 text-right">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-5 font-mono text-xs text-slate-400 font-bold tracking-tighter group-hover:text-slate-900">{r.nik}</td>
                  <td className="px-10 py-5 font-black text-slate-800">{r.name}</td>
                  <td className="px-10 py-5 font-bold text-slate-500">RT {r.rt} • {r.dusun}</td>
                  <td className="px-10 py-5 text-right">
                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${r.status === ResidentStatus.ALIVE ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center text-slate-400 italic font-medium">Tidak ada data yang sesuai dengan filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
