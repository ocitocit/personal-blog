'use client'; // Pastikan ini tetap ada jika LanguageSwitcher adalah client component

import LanguageSwitcher from './LanguageSwitcher';
import NavLinks from './NavLinks'; // Impor NavLinks yang baru

type NavbarProps = {
  lang: string;
};

export default function Navbar({ lang }: NavbarProps) {
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <NavLinks lang={lang} /> {/* Gunakan NavLinks di sini */}
      <LanguageSwitcher />
    </header>
  );
}
