'use client';

import Link from 'next/link';

type NavLinksProps = {
  lang: string;
};

export default function NavLinks({ lang }: NavLinksProps) {
  return (
    <nav className="flex space-x-4">
      <Link href={`/${lang}`}>
        <span className="hover:text-blue-400">Home</span>
      </Link>
      <Link href={`/${lang}/blog`}>
        <span className="hover:text-blue-400">Blog</span>
      </Link>
      <Link href={`/${lang}/profile`}>
        <span className="hover:text-blue-400">Profile</span>
      </Link>
      <Link href={`/${lang}/contact`}>
        <span className="hover:text-blue-400">Contact</span>
      </Link>
    </nav>
  );
}
