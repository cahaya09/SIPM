
import { Resident, Gender, MaritalStatus, ResidentStatus } from './types';

const STORAGE_KEY = 'sipm_premium_v1';

const initialData: Resident[] = [
  {
    id: '1',
    nik: '3171010101010001',
    name: 'Budi Santoso',
    gender: Gender.MALE,
    dob: '1985-05-15',
    address: 'Jl. Merdeka No. 10',
    rt: '001',
    dusun: 'Krajan',
    maritalStatus: MaritalStatus.MARRIED,
    occupation: 'PNS',
    status: ResidentStatus.ALIVE,
    createdAt: new Date().toISOString()
  }
];

export const dbService = {
  getResidents: (): Resident[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(data);
  },

  isNikExists: (nik: string, excludeId?: string): boolean => {
    const residents = dbService.getResidents();
    return residents.some(r => r.nik === nik && r.id !== excludeId);
  },

  saveResidents: (residents: Resident[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(residents));
  },

  addResident: (resident: Omit<Resident, 'id' | 'createdAt'>): Resident => {
    if (dbService.isNikExists(resident.nik)) {
      throw new Error('NIK ini sudah terdaftar dalam sistem. Gunakan NIK yang berbeda.');
    }
    const residents = dbService.getResidents();
    const newResident: Resident = {
      ...resident,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    residents.push(newResident);
    dbService.saveResidents(residents);
    return newResident;
  },

  updateResident: (id: string, updatedData: Partial<Resident>): Resident => {
    if (updatedData.nik && dbService.isNikExists(updatedData.nik, id)) {
      throw new Error('NIK baru sudah digunakan oleh penduduk lain.');
    }
    const residents = dbService.getResidents();
    const index = residents.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Data tidak ditemukan.');
    
    residents[index] = { ...residents[index], ...updatedData };
    dbService.saveResidents(residents);
    return residents[index];
  },

  deleteResident: (id: string): void => {
    const residents = dbService.getResidents();
    const filtered = residents.filter(r => r.id !== id);
    dbService.saveResidents(filtered);
  }
};
