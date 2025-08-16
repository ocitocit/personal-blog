import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import React from 'react';

// Fungsi untuk mengambil satu postingan blog berdasarkan slug
async function getBlogPost(lang: string, slug: string) {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/blog-posts?locale=${lang}&filters[slug][$eq]=${slug}&populate=*`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch blog post');
  }

  const data = await res.json();
  // Mengembalikan objek postingan pertama, bukan array
  return data.data[0];
}

export async function generateMetadata({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = await params;
  const post = await getBlogPost(lang, slug);

  if (!post) {
    return {};
  }

  const seoTitle = post.title || 'Blog Post';
  const seoDescription = post.content.substring(0, 150) + '...' || 'Read this interesting blog post.';
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
    },
  };
}

export default async function BlogPostPage({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = await params;
  const post = await getBlogPost(lang, slug);

  if (!post) {
    return (
      <div className="container mx-auto p-8 text-center text-white">
        <h1 className="text-4xl font-bold">404 - Post Not Found</h1>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      {post.coverImage && post.coverImage[0] && (
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${post.coverImage[0].url}`}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
      <p className="text-gray-400 text-sm mb-8">
        {post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString(lang, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : 'No date'}
      </p>
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{post.content}</ReactMarkdown>
      </div>
    </main>
  );
}
