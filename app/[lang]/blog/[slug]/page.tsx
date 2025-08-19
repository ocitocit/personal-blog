import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import React from 'react';
import { redirect } from 'next/navigation'; // Impor fungsi redirect
import CommentForm from '@/app/components/CommentForm';

// Fungsi untuk mengambil satu postingan blog
async function getBlogPost(lang: string, slug: string) {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/blog-posts?locale=${lang}&filters[slug][$eq]=${slug}&populate=*`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch blog post: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data.data[0];
}

// Fungsi untuk membuat metadata dinamis (SEO)
export async function generateMetadata({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = await params;
  const post = await getBlogPost(lang, slug);
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
  const seoTitle = post.title || 'Blog Post';
  const seoDescription = post.content ? post.content.substring(0, 150) + '...' : 'Read this interesting blog post.';
  const seoImage =
    post.coverImage && post.coverImage[0]
      ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${post.coverImage[0].url}`
      : null;
  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: seoImage ? [{ url: seoImage }] : [],
      type: 'article',
      locale: lang,
    },
  };
}

// Komponen halaman postingan blog tunggal
export default async function BlogPostPage({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = await params;
  const post = await getBlogPost(lang, slug);

  // LOGIKA PERBAIKAN: Jika postingan tidak ditemukan, arahkan ke halaman blog
  if (!post) {
    redirect(`/${lang}/blog`);
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      {post.coverImage && post.coverImage[0] && (
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${post.coverImage[0].url}`}
            alt={post.title || 'Cover Image'}
            fill
            className="object-cover"
          />
        </div>
      )}
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 text-center">{post.title}</h1>
      <p className="text-gray-400 text-sm mb-8 text-center">
        {post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString(lang, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : 'No date'}
      </p>
      <div className="prose prose-invert max-w-none mx-auto p-4 md:p-8 bg-gray-800 rounded-lg shadow-xl">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{post.content}</ReactMarkdown>
      </div>

      {/* Tambahkan komponen formulir komentar di sini */}
      <CommentForm postId={post.id} />
    </main>
  );
}
