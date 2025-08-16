'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  // Mendapatkan bahasa saat ini dari pathname, default ke 'en'
  const currentLang = pathname.split('/')[1] || 'en';

  // Tentukan bahasa berikutnya
  const nextLang = currentLang === 'en' ? 'id' : 'en';

  const changeLanguage = () => {
    // Mengganti bahasa di URL tanpa mengubah sisa path
    const newPathname = pathname.replace(`/${currentLang}`, `/${nextLang}`);
    router.push(newPathname);
  };

  return (
    <button
      onClick={changeLanguage}
      className="p-2 text-3xl transition-transform transform hover:scale-110"
      aria-label={`Switch to ${nextLang === 'en' ? 'English' : 'Indonesian'}`}
    >
      {/* Menampilkan ikon bendera berdasarkan bahasa saat ini */}
      {currentLang === 'en' ? '🇬🇧' : '🇮🇩'}
    </button>
  );
}
