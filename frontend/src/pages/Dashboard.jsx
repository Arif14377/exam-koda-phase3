import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LinkCard from '../components/LinkCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';

const Dashboard = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [myLinks, setMyLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  // Fetch data dari API saat component mount
  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    if (!isDeleteOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDeleteOpen(false);
        setDeleteTargetId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDeleteOpen]);

  const fetchLinks = async () => {
    try {
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
          logout();
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

  const handleRequestDelete = (linkId) => {
    setError('');
    setDeleteTargetId(linkId);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setDeleteBusy(true);
      const response = await fetch(`${API_URL}/api/links/${deleteTargetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMyLinks((prev) => prev.filter(link => link.id !== deleteTargetId));
        setIsDeleteOpen(false);
        setDeleteTargetId(null);
      } else {
        if (response.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        setError('Gagal menghapus link');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghapus');
      console.error(err);
    } finally {
      setDeleteBusy(false);
    }
  };

  // Filter berdasarkan search
  const filteredLinks = myLinks.filter(link =>
    link.original_url?.toLowerCase().includes(search.toLowerCase()) ||
    link.slug?.toLowerCase().includes(search.toLowerCase())
  );

  const deleteTarget = deleteTargetId
    ? myLinks.find((l) => l.id === deleteTargetId)
    : null;

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
                      onDelete={handleRequestDelete}
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

        {isDeleteOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={() => { if (!deleteBusy) { setIsDeleteOpen(false); setDeleteTargetId(null); } }}
          >
            <div
              className="w-full max-w-md bg-white rounded-xl border border-gray-200 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus link ini?</h3>
              <p className="text-sm text-gray-600 mb-5">
                Tindakan ini akan menghapus link kamu.
              </p>
              {deleteTarget && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-5">
                  <p className="text-xs text-gray-500 mb-1">Slug</p>
                  <p className="text-sm font-semibold text-gray-900 break-all">{deleteTarget.slug}</p>
                  <p className="text-xs text-gray-500 mt-2 mb-1">Original URL</p>
                  <p className="text-sm text-gray-700 break-all">{deleteTarget.original_url}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={deleteBusy}
                  className="w-full border border-gray-200 py-2 rounded-md text-gray-700 font-semibold disabled:opacity-60"
                  onClick={() => { setIsDeleteOpen(false); setDeleteTargetId(null); }}
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={deleteBusy}
                  className="w-full bg-red-600 text-white py-2 rounded-md font-semibold disabled:opacity-60"
                  onClick={handleConfirmDelete}
                >
                  {deleteBusy ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer showFull/>
      </div>
  );
};

export default Dashboard;
