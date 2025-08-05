// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { i18n } from './lib/i18n';

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = i18n.defaultLocale;

    // e.g. /products -> /en/products
    return NextResponse.redirect(new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url));
  }

  // The remaining pages are all handled correctly by Next.js's i18n routing
  return NextResponse.next();
}

export const config = {
  // The default `matcher` is already configured for this example to work.
  // It matches all requests except for files and API routes.
  matcher: [
    // Exclude files with a "." and Next.js internal paths
    '/((?!_next|favicon.ico|api|images|logo|assets).*)',
  ],
};
