// app/[lang]/blog/page.tsx
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import ReactMarkdown from 'react-markdown'; // Tambahkan ini
import React from 'react'; // Pastikan React diimpor

type Post = {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
  coverImage: any[];
};

async function getBlogPosts(lang: string, page: number) {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/blog-posts?locale=${lang}&populate=*&sort=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=5`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    console.error(`Failed to fetch posts: ${res.statusText}`);
    return { data: [], meta: { pagination: { pageCount: 0 } } };
  }

  const data = await res.json();
  return data;
}

const BlogPage: NextPage<{ params: { lang: string } }> = ({ params }) => {
  const { lang } = React.use(params);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const response = await getBlogPosts(lang, page);
      const newPosts = response.data || [];
      const totalPages = response.meta?.pagination?.pageCount || 0;

      if (page === 1) {
        setPosts(newPosts);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      }

      setHasMore(page < totalPages);
      setLoading(false);
    };

    fetchPosts();
  }, [lang, page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500 &&
        !loading &&
        hasMore
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">{lang === 'en' ? 'Blog Posts' : 'Artikel Blog'}</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center">
            {post.coverImage && post.coverImage[0] && (
              <div className="w-48 h-32 relative mr-6 flex-shrink-0">
                <Image
                  src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${post.coverImage[0].formats.thumbnail.url}`}
                  alt={post.title}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <div className="flex-grow">
              <h2 className="text-2xl font-semibold text-white mb-2">{post.title}</h2>
              <p className="text-gray-400 text-sm mb-2">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString(lang, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'No date'}
              </p>
              {/* Perubahan di sini: Menggunakan ReactMarkdown */}
              <div className="text-gray-300 markdown-content prose-base prose-invert line-clamp-3">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading && (
        <div className="text-center text-white mt-8">
          {lang === 'en' ? 'Loading more posts...' : 'Memuat lebih banyak artikel...'}
        </div>
      )}
      {!hasMore && (
        <div className="text-center text-gray-400 mt-8">
          {lang === 'en' ? 'You have reached the end of the posts.' : 'Anda telah mencapai akhir artikel.'}
        </div>
      )}
    </main>
  );
};

export default BlogPage;
