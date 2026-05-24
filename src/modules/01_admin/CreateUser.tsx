import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, Building, MapPin, Eye, EyeOff, Briefcase, Phone, Fingerprint } from 'lucide-react';
import { Button } from '@/src/components/Button.tsx';
import { UserRole } from '@/src/types.ts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext.tsx';

export default function CreateUser() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userId: '', // Login ID
    password: '',
    role: UserRole.USER,
    department: '',
    designation: '',
    company: '',
    site: ''
  });

  // Auto-generate User ID based on name and role for convenience
  useEffect(() => {
    if (formData.name && !formData.userId) {
      const prefix = formData.role === UserRole.SUPER_ADMIN ? 'SA' : 
                     formData.role === UserRole.ADMIN ? 'AD' : 'DS';
      const random = Math.floor(1000 + Math.random() * 9000);
      const namePart = formData.name.split(' ')[0].toUpperCase();
      setFormData(prev => ({ ...prev, userId: `${prefix}${namePart}${random}` }));
    }
  }, [formData.name, formData.role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('User Registered with Security Credentials:', formData);
    alert(`Account Created Successfully!\nUser ID: ${formData.userId}\nPassword: [REDACTED]\n\nPlease provide these credentials to the employee.`);
    navigate('/admin/users');
  };

  // Only Super Admin can create Admins
  const availableRoles = Object.values(UserRole).filter(role => {
    if (currentUser?.role === UserRole.SUPER_ADMIN) return true;
    if (currentUser?.role === UserRole.ADMIN) {
      return role !== UserRole.SUPER_ADMIN && role !== UserRole.ADMIN;
    }
    return false;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
          <UserPlus className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create System User</h2>
          <p className="text-slate-500 font-medium italic">Assign identity, authority and operational boundaries</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Identity Details
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700 transition-all"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="tel" 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700 transition-all"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700 transition-all"
                placeholder="rahul@dascon.in"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="pt-4 border-t border-slate-50">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Generated Credentials</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1">
                    <Fingerprint className="w-3 h-3" /> Login User ID
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-blue-50/50 border border-blue-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-black text-blue-600 transition-all font-mono"
                    placeholder="DS_RAHUL_44"
                    value={formData.userId}
                    onChange={e => setFormData({...formData, userId: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Security Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700 transition-all"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Organizational Role
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Department</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700 transition-all"
                  placeholder="e.g. Accounts"
                  value={formData.department}
                  onChange={e => setFormData({...formData, department: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Designation</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700 transition-all"
                  placeholder="e.g. Senior Manager"
                  value={formData.designation}
                  onChange={e => setFormData({...formData, designation: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1 font-black text-blue-600">Assign Authorities (Role)</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 transition-all appearance-none"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
              >
                {availableRoles.map(role => (
                  <option key={role} value={role}>{role.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Assigned Company</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700 transition-all"
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
              >
                <option value="">Choose Company...</option>
                <option value="C1">Dascon Saurav</option>
                <option value="C2">Dascon Infra Projects</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Primary Site</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700 transition-all"
                disabled={formData.role === UserRole.SUPER_ADMIN}
                value={formData.site}
                onChange={e => setFormData({...formData, site: e.target.value})}
              >
                <option value="">{formData.role === UserRole.SUPER_ADMIN ? 'All Sites (Super Admin)' : 'Choose Site...'}</option>
                <option value="S1">NH44 Highway - Section 1</option>
                <option value="S2">Metro Line 3</option>
              </select>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 pt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/admin/users')}>Cancel & Return</Button>
          <Button type="submit" className="px-12">Register New User</Button>
        </div>
      </form>
    </div>
  );
}
