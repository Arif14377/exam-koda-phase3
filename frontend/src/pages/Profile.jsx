import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLink, HiOutlineBell, HiOutlineShieldCheck, HiOutlineLogout, HiPencil } from 'react-icons/hi';
import Footer from '../components/Footer';
import TopNavBar from '../components/Navbar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        setError(data.message || 'Gagal mengambil data profile');
        return;
      }

      setProfile(data.results);
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createdAt = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '-';

  return (
    <>
        <TopNavBar/>
    
        <div className="bg-gray-50 min-h-screen p-8 flex flex-col items-center font-sans">
        {/* Account Manajemen */}
        <div className="w-full max-w-2xl mb-2">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Account Management
            </span>
        </div>

        {/* Main content */}
        <div className="bg-white border border-gray-200 rounded-xl w-full max-w-2xl p-8">

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}
            
            {/* Header Profile: Nama & Badge */}
            <div className="flex justify-between items-start mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
            {profile?.badge_pro && (
                <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded">
                    PRO MEMBER
                </span>
            )}
            </div>

            {/* Foto Profil & Info Nama */}
            <div className="flex items-center gap-4 mb-8">
            <div className="relative">
                <img 
                src="https://placehold.co/80x80" 
                alt="Avatar" 
                className="w-20 h-20 rounded-xl bg-gray-200"
                />
                <button className="absolute -bottom-2 -right-2 bg-white border border-gray-200 p-1 rounded-full text-blue-600">
                <HiPencil size={14} />
                </button>
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-900">
                    {loading ? 'Loading...' : (profile?.full_name || 'User')}
                </h2>
                <p className="text-gray-500 text-sm">
                    {loading ? 'Loading...' : (profile?.occupation || 'Occupation not set')}
                </p>
            </div>
            </div>

            {/* Grid Email & Tenure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Email Address</p>
                <p className="text-gray-800 text-sm font-medium">
                    {loading ? 'Loading...' : (profile?.email || '-')}
                </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Account Tenure</p>
                <p className="text-gray-800 text-sm font-medium">
                    Member since: {loading ? 'Loading...' : createdAt}
                </p>
            </div>
            </div>

            {/* Banner Biru */}
            <div className="bg-blue-600 rounded-lg p-5 flex items-center justify-between mb-8">
            <div className="flex items-center gap-4 text-white">
                <div className="bg-blue-500 p-2 rounded">
                <HiOutlineLink size={24} />
                </div>
                <div>
                <p className="text-[10px] font-bold uppercase opacity-80">Active Assets</p>
                <p className="text-2xl font-bold">
                    {loading ? '...' : (profile?.active_links ?? 0)}
                </p>
                </div>
            </div>
            <button className="bg-blue-500 text-white border border-blue-400 px-4 py-2 rounded-md text-sm font-semibold">
                VIEW LINKS
            </button>
            </div>

            {/* Menu List (Notifications & 2FA) */}
            <div className="space-y-4 mb-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-700">
                <HiOutlineBell size={20} className="text-gray-400" />
                <span className="text-sm font-medium">Email Notifications</span>
                </div>
                {/* Toggle email */}
                <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-700">
                <HiOutlineShieldCheck size={20} className="text-gray-400" />
                <span className="text-sm font-medium">Two-Factor Authentication</span>
                </div>
                <span className="text-[10px] font-bold text-red-400 uppercase">Disabled</span>
            </div>
            </div>

            {/* Tombol logout */}
            <button className="w-full border border-gray-200 py-3 rounded-lg flex items-center justify-center gap-2 text-gray-600 font-semibold text-sm">
            <HiOutlineLogout /> Logout Session
            </button>

        </div>

        {/* Privacy Note */}
        <p className="mt-6 text-[10px] text-gray-400">
            Your data is encrypted using AES-256 standards. <a href="#" className="text-blue-500 underline">Privacy Policy</a>
        </p>

        
        </div>
        <Footer showFull/>
    </>
  );
};

export default Profile;
