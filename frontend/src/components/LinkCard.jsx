import React, { useState } from 'react';
import { IoLink } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import { MdBarChart } from "react-icons/md";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';

const LinkCard = ({ id, shortUrl, originalUrl, date, clicks, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullUrl = `${API_URL}/${shortUrl}`;
    navigator.clipboard.writeText(fullUrl);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
      <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white flex justify-between items-center">
        {/* Bagian Kiri */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-600 font-semibold text-lg flex gap-2"> <IoLink/> {shortUrl}</span>
          </div>
          <p className="text-gray-500 text-sm mb-3 truncate max-w-md">
            {originalUrl}
          </p>
          <div className="flex gap-4 text-gray-400 text-xs font-medium uppercase tracking-wider">
            <span className="flex gap-1"><CiCalendar/> {date}</span>
            <span className="flex gap-1"><MdBarChart/> {clicks} Clicks</span>
          </div>
        </div>

        {/* Bagian Kanan */}
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className={`p-2 rounded border transition-colors ${
              copied 
                ? 'bg-green-50 text-green-600 border-green-100' 
                : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 bg-gray-50 text-gray-600 rounded border border-gray-200 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
  );
};

export default LinkCard;