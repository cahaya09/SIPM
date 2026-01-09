
export enum Gender {
  MALE = 'Laki-laki',
  FEMALE = 'Perempuan'
}

export enum MaritalStatus {
  SINGLE = 'Belum Kawin',
  MARRIED = 'Kawin',
  DIVORCED = 'Cerai Hidup',
  WIDOWED = 'Cerai Mati'
}

export enum ResidentStatus {
  ALIVE = 'Hidup',
  DECEASED = 'Meninggal'
}

export enum UserRole {
  ADMIN = 'Admin',
  STAFF = 'Petugas'
}

export interface Resident {
  id: string;
  nik: string;
  name: string;
  gender: Gender;
  dob: string;
  address: string;
  rt: string;
  dusun: string;
  maritalStatus: MaritalStatus;
  occupation: string;
  status: ResidentStatus;
  deathCertificateImg?: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  fullName: string;
}
