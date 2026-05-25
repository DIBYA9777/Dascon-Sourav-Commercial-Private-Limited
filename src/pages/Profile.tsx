import React from 'react';
import { useAuth } from '@/src/context/AuthContext.tsx';
import { User, Shield, Contact, Building, MapPin, Phone, Mail, Calendar, Droplet, CreditCard, Lock } from 'lucide-react';
import { Modal } from '@/src/components/Modal.tsx';

export default function ProfilePage() {
  const { user } = useAuth();
  
  // Reset Password State Definitions
  const [isResetOpen, setIsResetOpen] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  if (!user) return null;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      // Simulate API call for demonstration/testing on Frontend
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccessMsg('Your security password has been updated successfully (Simulated).');
      // Reset states
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setIsResetOpen(false);
        setSuccessMsg(null);
      }, 2000);
    } catch (err: any) {
      setErrorMsg('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        { label: "Father's Name", value: user.fatherName || 'Rahul' }, // Mocking for demo if empty
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
           <button className="bg-white/5 hover:bg-white/10 transition-all px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 cursor-pointer">
             Edit Profile
           </button>
           <button 
             onClick={() => setIsResetOpen(true)}
             className="bg-blue-600 hover:bg-blue-700 transition-all px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/50 cursor-pointer"
           >
             Reset Password
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

      {/* RESET PASSWORD MODAL */}
      <Modal
        isOpen={isResetOpen}
        onClose={() => {
          setIsResetOpen(false);
          setErrorMsg(null);
          setSuccessMsg(null);
        }}
        title="Reset Security Password"
      >
        <form onSubmit={handleResetPassword} className="space-y-4 text-left">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border-l-4 border-rose-500 rounded-xl">
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-relaxed">
                {errorMsg}
              </p>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-xl">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-relaxed">
                {successMsg}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="new-profile-pass" className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">New Password</label>
              <div className="relative group">
                <input
                  id="new-profile-pass"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-blue-500 transition-all font-bold text-slate-800 placeholder:text-slate-300 text-xs"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="confirm-profile-pass" className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
              <div className="relative group">
                <input
                  id="confirm-profile-pass"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-blue-500 transition-all font-bold text-slate-800 placeholder:text-slate-300 text-xs"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsResetOpen(false);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
