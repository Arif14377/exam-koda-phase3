import TopNavBar from "../components/Navbar"
import Footer from "../components/Footer"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiLink, HiOutlineEye, HiOutlineTrendingUp, HiOutlineQrcode, HiLightningBolt } from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';

const CreateLink = () => {
    const navigate = useNavigate();
    const [originalUrl, setOriginalUrl] = useState('');
    const [customSlug, setCustomSlug] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Validasi URL
    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    // Handle Create Link
    const handleCreateLink = async () => {
        // Reset pesan
        setError('');
        setSuccess('');

        // Validasi
        if (!originalUrl.trim()) {
            setError('URL tidak boleh kosong');
            return;
        }

        if (!isValidUrl(originalUrl)) {
            setError('URL harus valid (contoh: https://example.com)');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            // Siapkan data
            const payload = {
                original_url: originalUrl,
                slug: customSlug || '' // Boleh kosong, auto generate (random)
            };

            // kirim ke API
            const response = await fetch(`${API_URL}/api/links`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Gagal membuat short link');
                return;
            }

            // Sukses
            setSuccess('Link berhasil dibuat!');
            setOriginalUrl('');
            setCustomSlug('');

            // Redirect ke dashboard setelah 1 detik
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } catch (err) {
            setError('Terjadi kesalahan: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    return (
        <>
            <TopNavBar/>
            <main>
                <div className="bg-gray-50 min-h-screen py-10">
                    <div className="container mx-auto max-w-2xl px-4">
                        
                        {/* Tombol Back */}
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center text-blue-600 font-medium mb-4 gap-2 hover:text-blue-700"
                        >
                            <HiArrowLeft /> Back to Dashboard
                        </button>

                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">Create New Short Link</h1>
                            <p className="text-gray-500">Transform your long URLs into clean, manageable assets.</p>
                        </div>

                        {/* Form Card Utama */}
                        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-10">
                        
                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                    {error}
                                </div>
                            )}

                            {/* Success Message */}
                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                                    {success}
                                </div>
                            )}
                        
                            {/* Input Original URL */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
                                Destination URL <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <HiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="url" 
                                        value={originalUrl}
                                        onChange={(e) => setOriginalUrl(e.target.value)}
                                        placeholder="https://example.com/your-long-url-here"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-2 italic">Ensure your URL starts with http:// or https://</p>
                            </div>

                            {/* Input Custom Slug */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
                                Custom Slug (Optional)
                                </label>
                                <div className="flex">
                                    <span className="bg-gray-100 border border-r-0 border-gray-300 px-4 py-3 text-gray-500 rounded-l">
                                        short.link/
                                    </span>
                                    <input 
                                        type="text" 
                                        value={customSlug}
                                        onChange={(e) => setCustomSlug(e.target.value)}
                                        placeholder="my-custom-slug"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-r focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-2 italic">Leave blank to generate a random unique identifier.</p>
                            </div>

                            {/* Live Preview */}
                            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-8">
                                <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase mb-1">
                                <HiOutlineEye size={16} /> Live Preview
                                </div>
                                <p className="text-gray-700">
                                Your short link will be: <span className="text-blue-600 font-semibold">short.link/{customSlug || 'random-id'}</span>
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-6">
                                <button 
                                    onClick={handleCreateLink}
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-6 py-3 rounded font-semibold flex items-center gap-2 hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                                >
                                    {loading ? 'Creating...' : 'Create Link'} <HiLightningBolt />
                                </button>
                                <button 
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="text-gray-500 font-medium hover:text-gray-700 disabled:text-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                        {/* Feature */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex gap-4">
                                <div className="bg-orange-100 p-3 rounded-full h-fit text-orange-600">
                                    <HiOutlineTrendingUp size={24} />
                                </div>
                                <div>
                                <h3 className="font-bold text-gray-800">Real-time Analytics</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Track every click, geographical location, and referral source instantly.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-blue-100 p-3 rounded-full h-fit text-blue-600">
                                    <HiOutlineQrcode size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">Auto-generated QR</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">Every link automatically creates a high-resolution QR code for print.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer showFull/>
        </>
    )
}

export default CreateLink