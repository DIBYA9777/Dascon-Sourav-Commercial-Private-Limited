import React, { useState } from 'react';
import { 
  UserPlus, 
  Shield, 
  Eye, 
  EyeOff, 
  Fingerprint, 
  Save, 
  RotateCcw,
  CheckCircle2,
  Plus,
  X,
  Phone,
  CreditCard,
  Building,
  Calendar,
  Contact
} from 'lucide-react';
import { Button } from '@/src/components/Button.tsx';
import { UserRole } from '@/src/types.ts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext.tsx';

export default function CreateUser() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [emailInUse, setEmailInUse] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER' as string,
    phoneNumber: '',
    employeeId: '',
    panNumber: '',
    aadharNumber: '',
    dateOfBirth: '',
    dateOfJoining: '',
    gender: '',
    maritalStatus: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    companyId: '',
    locationId: '',
    siteId: '',
    modulePermissions: [] as string[],
    sectionPermissions: [] as string[],
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [lastCreatedUser, setLastCreatedUser] = useState<any>(null);

  // Suggested Defaults for the Matrix Configuration
  const standardModules = ['ADMIN', 'PURCHASE', 'INVENTORY', 'HR', 'MACHINERY', 'ACCOUNTS'];
  const standardSections = ['CREATE_USER', 'MODIFY_USER', 'DELETE_USER', 'ASSIGN_PERMISSIONS', 'MANAGE_ROLES', 'VIEW_REPORTS', 'VIEW_REQUISITION'];

  const [customModule, setCustomModule] = useState('');
  const [customSection, setCustomSection] = useState('');

  const toggleModulePermission = (moduleName: string) => {
    setFormData(prev => {
      const exists = prev.modulePermissions.includes(moduleName);
      return {
        ...prev,
        modulePermissions: exists 
          ? prev.modulePermissions.filter(m => m !== moduleName)
          : [...prev.modulePermissions, moduleName]
      };
    });
  };

  const toggleSectionPermission = (sectionName: string) => {
    setFormData(prev => {
      const exists = prev.sectionPermissions.includes(sectionName);
      return {
        ...prev,
        sectionPermissions: exists 
          ? prev.sectionPermissions.filter(s => s !== sectionName)
          : [...prev.sectionPermissions, sectionName]
      };
    });
  };

  const handleAddCustomModule = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customModule.trim().toUpperCase();
    if (clean && !formData.modulePermissions.includes(clean)) {
      setFormData(prev => ({
        ...prev,
        modulePermissions: [...prev.modulePermissions, clean]
      }));
    }
    setCustomModule('');
  };

  const handleAddCustomSection = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customSection.trim().toUpperCase();
    if (clean && !formData.sectionPermissions.includes(clean)) {
      setFormData(prev => ({
        ...prev,
        sectionPermissions: [...prev.sectionPermissions, clean]
      }));
    }
    setCustomSection('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setErrorMsg('First Name, Last Name, Email, and Password are all required.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    // Cast IDs dynamically to support expected types
    const parseIdValue = (val: string) => {
      const trimmed = val.trim();
      if (!trimmed) return null;
      const parsed = Number(trimmed);
      return isNaN(parsed) ? trimmed : parsed;
    };

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        phoneNumber: formData.phoneNumber.trim() || null,
        employeeId: formData.employeeId.trim() || null,
        panNumber: formData.panNumber.trim() || null,
        aadharNumber: formData.aadharNumber.trim() || null,
        dateOfBirth: formData.dateOfBirth || null,
        dateOfJoining: formData.dateOfJoining || null,
        gender: formData.gender || null,
        maritalStatus: formData.maritalStatus || null,
        accountNumber: formData.accountNumber.trim() || null,
        bankName: formData.bankName.trim() || null,
        ifscCode: formData.ifscCode.trim() || null,
        companyId: parseIdValue(formData.companyId),
        locationId: parseIdValue(formData.locationId),
        siteId: parseIdValue(formData.siteId),
        modulePermissions: formData.modulePermissions,
        sectionPermissions: formData.sectionPermissions
      };

      // Direct API proxy integration
      const response = await registerUser(payload);

      const registeredData = response?.data || {
        id: Math.random().toString(36).substr(2, 9),
        ...payload,
        isActive: true,
      };

      // Also persist to local list for instantaneous dashboard listing updates
      const fallbackUserLocal = {
        id: registeredData.id || String(Math.floor(Math.random() * 10000)),
        userId: registeredData.email || formData.email,
        name: `${registeredData.firstName || formData.firstName} ${registeredData.lastName || formData.lastName}`.trim(),
        email: registeredData.email || formData.email,
        role: (registeredData.role as UserRole) || UserRole.USER,
        status: 'ACTIVE',
        modulePermissions: registeredData.modulePermissions || [],
        sectionPermissions: registeredData.sectionPermissions || [],
        phoneNumber: registeredData.phoneNumber,
        employeeId: registeredData.employeeId,
        panNumber: registeredData.panNumber,
        aadharNumber: registeredData.aadharNumber,
        dateOfBirth: registeredData.dateOfBirth,
        dateOfJoining: registeredData.dateOfJoining,
        gender: registeredData.gender,
        maritalStatus: registeredData.maritalStatus,
        accountNumber: registeredData.accountNumber,
        bankName: registeredData.bankName,
        ifscCode: registeredData.ifscCode,
        companyId: registeredData.companyId,
        locationId: registeredData.locationId,
        siteId: registeredData.siteId,
      };

      const storedUsersJson = localStorage.getItem('dascon_system_users');
      const storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : [];
      storedUsers.push(fallbackUserLocal);
      localStorage.setItem('dascon_system_users', JSON.stringify(storedUsers));

      setLastCreatedUser({
        ...registeredData,
        password: formData.password // Preserve inputted password to display in raw response detail card
      });
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Core provision flow failed:', err);
      const isEmailRegistered = err.message && (
        err.message.toLowerCase().includes('already registered') || 
        err.message.toLowerCase().includes('email already')
      );
      if (isEmailRegistered) {
        setEmailInUse(true);
        setErrorMsg('EMAIL CONFLICT: The specified corporate email is already registered in the system.');
      } else {
        setErrorMsg(err.message || 'GATEWAY REGISTRY ERROR: Access Denied or Incorrect Formats.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess && lastCreatedUser) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Identity Provisioned</h2>
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">The staff member has been registered in the Global Registry</p>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl -mr-16 -mt-16" />
          
          <div className="text-left space-y-2 border-b border-slate-800 pb-5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Provisioned User</p>
            <p className="text-2xl font-black text-emerald-400 font-sans uppercase tracking-tight">
              {lastCreatedUser.firstName} {lastCreatedUser.lastName}
            </p>
            <p className="text-sm font-bold text-slate-400 select-all">{lastCreatedUser.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-left">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Role</p>
              <p className="text-xl font-black text-blue-400 font-mono tracking-tighter uppercase">{lastCreatedUser.role}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Password</p>
              <p className="text-xl font-black text-white font-mono tracking-tighter select-all">{lastCreatedUser.password}</p>
            </div>
          </div>

          {/* Expanded registration attributes summary card */}
          <div className="grid grid-cols-2 gap-4 text-left border-t border-slate-800 pt-5">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Phone Number</p>
              <p className="text-xs font-bold text-slate-300">{lastCreatedUser.phoneNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Employee ID</p>
              <p className="text-xs font-bold text-slate-300">{lastCreatedUser.employeeId || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">PAN Number</p>
              <p className="text-xs font-bold text-slate-300">{lastCreatedUser.panNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Aadhar Number</p>
              <p className="text-xs font-bold text-slate-300">{lastCreatedUser.aadharNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Date of Birth</p>
              <p className="text-xs font-bold text-slate-300">{lastCreatedUser.dateOfBirth || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Date of Joining</p>
              <p className="text-xs font-bold text-slate-300">{lastCreatedUser.dateOfJoining || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Gender</p>
              <p className="text-xs font-bold text-slate-300 uppercase">{lastCreatedUser.gender || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Marital Status</p>
              <p className="text-xs font-bold text-slate-300 uppercase">{lastCreatedUser.maritalStatus || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left border-t border-slate-800 pt-5">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Bank Name</p>
              <p className="text-xs font-bold text-slate-300">{lastCreatedUser.bankName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Account Number</p>
              <p className="text-xs font-bold text-slate-300">{lastCreatedUser.accountNumber || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">IFSC Code</p>
              <p className="text-xs font-bold text-slate-300 uppercase">{lastCreatedUser.ifscCode || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-left border-t border-slate-800 pt-5">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Company ID</p>
              <p className="text-xs font-bold text-slate-300">{lastCreatedUser.companyId !== null ? String(lastCreatedUser.companyId) : 'N/A'}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Location ID</p>
              <p className="text-xs font-bold text-slate-300">{lastCreatedUser.locationId !== null ? String(lastCreatedUser.locationId) : 'N/A'}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Site ID</p>
              <p className="text-xs font-bold text-slate-300">{lastCreatedUser.siteId !== null ? String(lastCreatedUser.siteId) : 'N/A'}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col gap-3">
             <div className="text-left space-y-1">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Module Entitlements</p>
               <div className="flex flex-wrap gap-1.5 pt-1">
                  {lastCreatedUser.modulePermissions?.map((mod: string) => (
                    <span key={mod} className="text-[8px] bg-slate-800 text-blue-400 font-black px-2 py-0.5 rounded-md uppercase tracking-wider">{mod}</span>
                  ))}
               </div>
             </div>

             <div className="text-left space-y-1">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Section Clearance Keys</p>
               <div className="flex flex-wrap gap-1.5 pt-1">
                  {lastCreatedUser.sectionPermissions?.map((sec: string) => (
                    <span key={sec} className="text-[8px] bg-slate-800 text-emerald-400 font-black px-2 py-0.5 rounded-md uppercase tracking-wider">{sec}</span>
                  ))}
               </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/superadmin/user-management')} variant="outline" className="rounded-2xl border-2 border-slate-100 px-8 py-6 font-black uppercase tracking-tight italic">
            Return to Registry
          </Button>
          <Button onClick={() => navigate('/login')} className="bg-slate-900 text-white rounded-2xl px-12 py-6 font-black uppercase tracking-tight italic shadow-xl shadow-slate-100 font-sans">
             Logout & Test Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 italic">
              <UserPlus className="w-6 h-6 text-white" />
           </div>
           <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Identity Registry</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Central Admin Provisioning Portal</p>
           </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="rounded-xl px-4 py-2 font-black border-2 border-slate-100 hover:bg-slate-50 transition-all">
            <RotateCcw className="w-3 h-3 mr-2" /> DISCARD
          </Button>
          <Button size="sm" onClick={handleSubmit} className="rounded-xl px-4 py-2 font-black bg-slate-900 shadow-xl shadow-slate-200 hover:scale-[1.02] transition-all text-white border-none shrink-0" loading={loading}>
            <Save className="w-3 h-3 mr-2" /> COMMIT USER
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border-2 border-rose-100 rounded-2xl p-4 text-rose-700 text-xs font-black uppercase tracking-wider flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-800 font-bold">X</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-6 space-y-6">
           {/* SECTION 1: CORE CREDENTIALS */}
           <section className="bg-white p-6 rounded-3xl border-2 border-slate-50 shadow-sm space-y-5 text-slate-900">
             <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
               <Fingerprint className="w-4 h-4 text-blue-600" />
               <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Profile Identifiers</h3>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                  <input 
                    type="text" required
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:border-blue-500 outline-none font-bold text-slate-700 text-sm shadow-inner"
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Rahul"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                  <input 
                    type="text" required
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:border-blue-500 outline-none font-bold text-slate-700 text-sm shadow-inner"
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Sharma"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                   <label className={`text-[10px] font-black uppercase tracking-widest ml-1 transition-colors duration-200 ${emailInUse ? 'text-rose-500' : 'text-slate-400'}`}>
                     Corporate Email
                   </label>
                   <input 
                     type="email" required
                     className={`w-full border rounded-xl py-2.5 px-4 outline-none font-bold text-slate-700 text-sm shadow-inner transition-all duration-200 ${
                       emailInUse 
                         ? 'bg-rose-50/55 border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-rose-950 font-black' 
                         : 'bg-slate-50 border-slate-100 focus:border-blue-500'
                     }`}
                     value={formData.email}
                     onChange={e => {
                       setEmailInUse(false);
                       setFormData({...formData, email: e.target.value});
                     }}
                     placeholder="rahul@dascon.in"
                   />
                   {emailInUse && (
                     <p className="text-rose-600 text-[10px] font-black uppercase tracking-wider mt-1 ml-1 flex items-center gap-1.5 animate-pulse">
                       <span>⚠️ This corporate email already exists in the system.</span>
                     </p>
                   )}
                </div>

                <div className="space-y-1 sm:col-span-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-mono">Password</label>
                   <div className="relative">
                     <input 
                       type={showPassword ? "text" : "password"} required
                       className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:border-blue-500 outline-none font-bold text-slate-700 text-sm shadow-inner pr-12"
                       value={formData.password}
                       onChange={e => setFormData({...formData, password: e.target.value})}
                       placeholder="Security Hash Key"
                     />
                     <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                       {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                     </button>
                   </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign User Role / Level</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:border-blue-500 outline-none font-black text-slate-700 text-sm capitalize"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Global Authority)</option>
                    <option value="ADMIN">ADMIN (Department Control)</option>
                    <option value="USER">USER (Standard Access)</option>
                  </select>
                </div>
             </div>
           </section>

           {/* SECTION 2: IDENTITY & EMPLOYMENT DETAILS */}
           <section className="bg-white p-6 rounded-3xl border-2 border-slate-50 shadow-sm space-y-5 text-slate-900">
             <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
               <Contact className="w-4 h-4 text-indigo-600" />
               <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Employment & Profile Identifiers</h3>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Employee ID</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:border-indigo-500 outline-none font-bold text-slate-700 text-sm shadow-inner"
                    value={formData.employeeId}
                    onChange={e => setFormData({...formData, employeeId: e.target.value})}
                    placeholder="e.g. DAS-P002"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:border-indigo-500 outline-none font-bold text-slate-700 text-sm shadow-inner"
                    value={formData.phoneNumber}
                    onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                    placeholder="e.g. +91 9876543210"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PAN Number</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:border-indigo-500 outline-none font-bold text-slate-700 text-sm shadow-inner uppercase"
                    value={formData.panNumber}
                    onChange={e => setFormData({...formData, panNumber: e.target.value})}
                    placeholder="ABCDE1234F"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Aadhar Number</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:border-indigo-500 outline-none font-bold text-slate-700 text-sm shadow-inner"
                    value={formData.aadharNumber}
                    onChange={e => setFormData({...formData, aadharNumber: e.target.value})}
                    placeholder="1234 5678 9012"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                  <input 
                    type="date"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:border-indigo-500 outline-none font-bold text-slate-700 text-sm shadow-inner"
                    value={formData.dateOfBirth}
                    onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Joining</label>
                  <input 
                    type="date"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:border-indigo-500 outline-none font-bold text-slate-700 text-sm shadow-inner"
                    value={formData.dateOfJoining}
                    onChange={e => setFormData({...formData, dateOfJoining: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({...formData, gender: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:border-indigo-500 outline-none font-bold text-slate-700 text-xs uppercase"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Marital Status</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={e => setFormData({...formData, maritalStatus: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:border-indigo-500 outline-none font-bold text-slate-700 text-xs uppercase"
                  >
                    <option value="">Select Status</option>
                    <option value="SINGLE">SINGLE</option>
                    <option value="MARRIED">MARRIED</option>
                    <option value="DIVORCED">DIVORCED</option>
                    <option value="WIDOWED">WIDOWED</option>
                  </select>
                </div>
             </div>
           </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-6 space-y-6">
           {/* SECTION 3: BANK & ERP ORGANIZATION */}
           <section className="bg-white p-6 rounded-3xl border-2 border-slate-50 shadow-sm space-y-5 text-slate-900">
             <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
               <CreditCard className="w-4 h-4 text-emerald-600" />
               <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Financial & ERP Organization Settings</h3>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bank Name</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:border-emerald-500 outline-none font-bold text-slate-700 text-sm shadow-inner"
                    value={formData.bankName}
                    onChange={e => setFormData({...formData, bankName: e.target.value})}
                    placeholder="HDFC Bank"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Number</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:border-emerald-500 outline-none font-bold text-slate-700 text-sm shadow-inner"
                    value={formData.accountNumber}
                    onChange={e => setFormData({...formData, accountNumber: e.target.value})}
                    placeholder="e.g. 501002345511"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">IFSC Code</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:border-emerald-500 outline-none font-bold text-slate-700 text-sm shadow-inner uppercase"
                    value={formData.ifscCode}
                    onChange={e => setFormData({...formData, ifscCode: e.target.value})}
                    placeholder="e.g. HDFC0000123"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company ID</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:border-emerald-500 outline-none font-bold text-slate-700 text-sm shadow-inner"
                    value={formData.companyId}
                    onChange={e => setFormData({...formData, companyId: e.target.value})}
                    placeholder="e.g. 1"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location ID</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:border-emerald-500 outline-none font-bold text-slate-700 text-sm shadow-inner"
                    value={formData.locationId}
                    onChange={e => setFormData({...formData, locationId: e.target.value})}
                    placeholder="e.g. 3"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Site ID</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 focus:border-emerald-500 outline-none font-bold text-slate-700 text-sm shadow-inner"
                    value={formData.siteId}
                    onChange={e => setFormData({...formData, siteId: e.target.value})}
                    placeholder="e.g. 10"
                  />
                </div>
             </div>
           </section>

           {/* SECTION 4: LIGHTWEIGHT INTEGRATED PERMISSIONS SECTION */}
           <section className="bg-white p-6 rounded-3xl border-2 border-slate-50 shadow-sm space-y-6">
             <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
               <Shield className="w-4 h-4 text-indigo-600" />
               <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Clearance Credentials</h3>
             </div>

             {/* MODULE PERMISSIONS */}
             <div className="space-y-3">
               <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Authorized Module Access</p>
                 <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Select allowed systems below or type custom tag</p>
               </div>
               
               <div className="flex flex-wrap gap-2">
                 {standardModules.map(modName => {
                   const isSelected = formData.modulePermissions.includes(modName);
                   return (
                     <button
                       type="button"
                       key={modName}
                       onClick={() => toggleModulePermission(modName)}
                       className={`px-3 py-1.5 rounded-xl font-black text-[10px] tracking-wider transition-all duration-200 uppercase ${
                         isSelected 
                           ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                           : 'bg-slate-50 text-slate-400 border border-slate-150 hover:bg-slate-100/70'
                       }`}
                     >
                       {modName}
                     </button>
                   );
                 })}
               </div>

               {/* Custom Module Item */}
               <div className="flex items-center gap-2 pt-1">
                 <input 
                   type="text"
                   value={customModule}
                   onChange={e => setCustomModule(e.target.value)}
                   className="flex-1 bg-slate-50 border border-slate-100 rounded-xl py-1.5 px-3 text-xs font-black uppercase text-slate-700"
                   placeholder="Or type custom module tag..."
                 />
                 <button 
                   type="button"
                   onClick={handleAddCustomModule}
                   className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-2 rounded-xl transition-all"
                 >
                   <Plus className="w-3.5 h-3.5" />
                 </button>
               </div>
             </div>

             {/* SECTION PERMISSIONS */}
             <div className="space-y-3 pt-3 border-t border-slate-100">
               <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Specific Section Clearances</p>
                 <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Select functional clearances or input custom codes</p>
               </div>

               <div className="flex flex-wrap gap-2">
                 {standardSections.map(secName => {
                   const isSelected = formData.sectionPermissions.includes(secName);
                   return (
                     <button
                       type="button"
                       key={secName}
                       onClick={() => toggleSectionPermission(secName)}
                       className={`px-3 py-1.5 rounded-xl font-black text-[10px] tracking-wider transition-all duration-200 uppercase ${
                         isSelected 
                           ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
                           : 'bg-slate-50 text-slate-400 border border-slate-150 hover:bg-slate-100/70'
                       }`}
                     >
                       {secName.replace('_', ' ')}
                     </button>
                   );
                 })}
               </div>

               {/* Custom Section Item */}
               <div className="flex items-center gap-2 pt-1">
                 <input 
                   type="text"
                   value={customSection}
                   onChange={e => setCustomSection(e.target.value)}
                   className="flex-1 bg-slate-50 border border-slate-100 rounded-xl py-1.5 px-3 text-xs font-black uppercase text-slate-700"
                   placeholder="Or type custom section key..."
                 />
                 <button 
                   type="button"
                   onClick={handleAddCustomSection}
                   className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-2 rounded-xl transition-all"
                 >
                   <Plus className="w-3.5 h-3.5" />
                 </button>
               </div>
             </div>

             {/* SUMMARY OF CLEARANCE ITEMS */}
             <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 space-y-3">
               <div>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Permissions Payload</p>
               </div>
               <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-600">
                 <div>
                   <p className="text-[8px] uppercase text-blue-500 font-black font-sans">Modules ({formData.modulePermissions.length})</p>
                   <div className="space-y-1 mt-1 max-h-[100px] overflow-y-auto">
                     {formData.modulePermissions.map(m => (
                       <div key={m} className="flex justify-between items-center bg-white px-2 py-1 rounded text-[10px] border border-slate-100 font-black uppercase tracking-wider">
                         <span>{m}</span>
                         <X className="w-2.5 h-2.5 text-slate-400 cursor-pointer" onClick={() => toggleModulePermission(m)} />
                       </div>
                     ))}
                   </div>
                 </div>
                 <div>
                   <p className="text-[8px] uppercase text-emerald-500 font-black font-mono font-bold">Sections ({formData.sectionPermissions.length})</p>
                   <div className="space-y-1 mt-1 max-h-[100px] overflow-y-auto">
                     {formData.sectionPermissions.map(s => (
                       <div key={s} className="flex justify-between items-center bg-white px-2 py-1 rounded text-[10px] border border-slate-100 font-black uppercase tracking-wider">
                         <span>{s}</span>
                         <X className="w-2.5 h-2.5 text-slate-400 cursor-pointer" onClick={() => toggleSectionPermission(s)} />
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
           </section>

           <div className="flex justify-end gap-3 pt-2">
             <Button type="button" variant="outline" onClick={() => navigate(-1)} className="rounded-xl font-black px-6">DISCARD</Button>
             <Button type="submit" className="bg-slate-900 border-none font-sans text-white hover:scale-[1.01] transition-all font-black px-10 rounded-xl shadow-xl shadow-slate-100" loading={loading}>
               PROVISION USER
             </Button>
           </div>
        </div>
      </form>
    </div>
  );
}
