import React from 'react';
import { useAuth } from '@/src/context/AuthContext.tsx';
import { User, Shield, Contact, Building, MapPin, Phone, Mail, Calendar, Droplet, CreditCard } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const sections = [
    {
      title: 'Professional Identity',
      icon: <Contact className="w-4 h-4 text-blue-600" />,
      fields: [
        { label: 'Employee ID', value: user.userId, highlight: true },
        { label: 'Department', value: user.department || 'N/A' },
        { label: 'Designation', value: user.designation || 'N/A' },
        { label: 'System Role', value: user.role.replace('_', ' ') },
      ]
    },
    {
      title: 'Personal Details',
      icon: <User className="w-4 h-4 text-emerald-600" />,
      fields: [
        { label: 'Father\'s Name', value: user.fatherName || 'Rahul' }, // Mocking for demo if empty
        { label: 'Date of Birth', value: user.dob || '1990-01-01' },
        { label: 'Blood Group', value: user.bloodGroup || 'O+' },
        { label: 'Qualification', value: user.qualification || 'B.Tech' },
      ]
    },
    {
      title: 'Contact Information',
      icon: <Phone className="w-4 h-4 text-amber-600" />,
      fields: [
        { label: 'Mobile Number', value: user.phone || 'N/A' },
        { label: 'Corporate Email', value: user.email },
        { label: 'Emergency Contact', value: user.emergencyContact || 'N/A' },
        { label: 'Current Address', value: user.address || 'N/A', fullWidth: true },
      ]
    },
    {
      title: 'Statutory & Banking',
      icon: <Building className="w-4 h-4 text-rose-600" />,
      fields: [
        { label: 'PAN Number', value: user.panNumber || 'ABCDE1234F' },
        { label: 'Aadhar Number', value: user.aadharNumber || '1234 5678 9012' },
        { label: 'Bank Account', value: user.accountNumber || '************' },
        { label: 'IFSC Code', value: user.ifscCode || 'HDFC0001234' },
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* HEADER CARD */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-4xl font-black italic shadow-xl z-10 shrink-0 border-4 border-white/10 uppercase">
          {user.name.charAt(0)}
        </div>
        <div className="text-center md:text-left z-10 space-y-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="text-3xl font-black tracking-tight">{user.name}</h1>
            <span className="bg-blue-600/20 text-blue-400 text-xs font-black px-2 py-0.5 rounded-full border border-blue-400/30 uppercase tracking-widest self-center">
              Verified User
            </span>
          </div>
          <p className="text-slate-200 font-bold flex items-center justify-center md:justify-start gap-2 text-sm uppercase italic">
            <Shield className="w-4 h-4 text-emerald-400" /> {user.designation || 'Corporate Staff'} • {user.department || 'HQ'}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-widest">
              <Calendar className="w-4 h-4" /> DOJ: {user.doj || '2024-01-01'}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-widest">
              <Droplet className="w-4 h-4 text-rose-500" /> BLOOD: {user.bloodGroup || 'O+'}
            </div>
          </div>
        </div>
        
        <div className="md:ml-auto flex gap-2 z-10">
           <button className="bg-white/5 hover:bg-white/10 transition-all px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">
             Edit Profile
           </button>
           <button className="bg-blue-600 hover:bg-blue-700 transition-all px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/50">
             Privacy Key
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <section key={idx} className="bg-white p-6 rounded-3xl border-2 border-slate-50 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
              {section.icon}
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">
                {section.title}
              </h3>
            </div>
            <div className={`grid ${section.fields.some(f => f.fullWidth) ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
              {section.fields.map((field, fIdx) => (
                <div key={fIdx} className={`space-y-1.5 ${field.fullWidth ? 'col-span-2' : ''}`}>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{field.label}</label>
                  <div className={`font-bold text-sm ${field.highlight ? 'text-blue-600 font-black font-mono' : 'text-slate-700'}`}>
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="bg-blue-50/50 p-6 rounded-3xl border-2 border-blue-100/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Identity Link</p>
            <p className="text-xs font-bold text-slate-600 italic">This ID is shared across all Dascon Infrastructure nodes.</p>
          </div>
        </div>
        <div className="text-[10px] font-black text-slate-400 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          NODE: IND-ORI-HQ-01
        </div>
      </div>
    </div>
  );
}
