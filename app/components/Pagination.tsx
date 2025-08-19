'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

type PaginationProps = {
  page: number;
  pageCount: number;
};

export default function Pagination({ page, pageCount }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const isFirstPage = page === 1;
  const isLastPage = page === pageCount;

  return (
    <div className="flex justify-center items-center space-x-4 mt-8">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={isFirstPage}
        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <div className="text-gray-300">
        Page {page} of {pageCount}
      </div>

      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={isLastPage}
        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
