import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LinkCard from '../components/LinkCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';

const Dashboard = () => {
  const navigate = useNavigate();
  const [myLinks, setMyLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Fetch data dari API saat component mount
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/links`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        setError(data.message || 'Gagal mengambil data');
        return;
      }

      if (data.results) {
        setMyLinks(data.results);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (linkId) => {
    if (!confirm('Yakin ingin menghapus link ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/links/${linkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMyLinks(myLinks.filter(link => link.id !== linkId));
      } else {
        setError('Gagal menghapus link');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghapus');
      console.error(err);
    }
  };

  // Filter berdasarkan search
  const filteredLinks = myLinks.filter(link =>
    link.original_url?.toLowerCase().includes(search.toLowerCase()) ||
    link.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar/>

        <main className="grow container mx-auto max-w-4xl px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Links</h1>
              <p className="text-gray-500 text-sm">Manage and track your shortened digital assets.</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase">Total Active</p>
              <p className="text-3xl font-bold text-blue-600">{myLinks.length}</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Input Search */}
          <div className="mb-8">
            <input
                type="text"
                placeholder="Search by name or URL..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Loading State */}
          {loading ? (
            <p className="text-center text-gray-500 py-8">Loading links...</p>
          ) : filteredLinks.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {search ? 'Link tidak ditemukan' : 'Belum ada link'}
            </p>
          ) : (
            /* List of Cards */
            <div>
              {filteredLinks.map((link) => (
                  <LinkCard
                      key={link.id}
                      id={link.id}
                      shortUrl={link.slug}
                      originalUrl={link.original_url}
                      date={new Date(link.created_at).toLocaleDateString('id-ID')}
                      clicks={link.clicks || 0}
                      onDelete={handleDelete}
                  />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredLinks.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-8 text-sm text-gray-600">
              <button className="hover:text-blue-600">Prev Page</button>
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded font-bold">1</span>
              <span>of 1</span>
              <button className="hover:text-blue-600">Next</button>
            </div>
          )}
        </main>

        <Footer showFull/>
      </div>
  );
};

export default Dashboard;