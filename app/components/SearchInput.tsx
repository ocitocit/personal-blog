'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearchTerm = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(currentSearchTerm);

  // Mengirim pencarian ke URL
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('q', searchTerm);
      // Atur ulang ke halaman 1 saat melakukan pencarian baru
      params.set('page', '1');
    } else {
      params.delete('q');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    setSearchTerm(currentSearchTerm);
  }, [currentSearchTerm]);

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari artikel..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
    </form>
  );
}
