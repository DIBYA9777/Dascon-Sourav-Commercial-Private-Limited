export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  HO_USER = 'HO_USER',
  SITE_ADMIN = 'SITE_ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  userId: string; // Employee/Login ID
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  department?: string;
  designation?: string;
  companyId?: string;
  siteIds?: string[];
  modulePermissions?: string[]; 
  sectionPermissions?: string[]; 
  status: 'ACTIVE' | 'INACTIVE';
  // Detailed Personal Info
  fatherName?: string;
  dob?: string;
  doj?: string; // Date of Joining
  bloodGroup?: string;
  panNumber?: string;
  aadharNumber?: string;
  emergencyContact?: string;
  address?: string;
  qualification?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  password?: string;
}

export interface Company {
  id: string;
  name: string;
  code: string;
  address: string;
  pan: string;
  gstin: string;
}

export interface Site {
  id: string;
  companyId: string;
  name: string;
  type: 'SITE' | 'PLANT' | 'PROJECT' | 'BRANCH';
  location: string;
}

export interface ApprovalStatus {
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'HOLD';
  remarks?: string;
  actionBy: string;
  actionAt: Date;
}
