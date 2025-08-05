async function getBlogPosts(lang: string) {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/blog-posts?locale=${lang}&populate=*`;
  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error(`Failed to fetch posts: ${res.statusText}`);
    return [];
  }

  const data = await res.json();
  return data.data;
}

export default async function BlogPage({ params }: { params: { lang: string } }) {
  // Ambil properti `lang` secara asinkron dari params
  const { lang } = await params;
  const posts = await getBlogPosts(lang);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">{lang === 'en' ? 'Blog Posts' : 'Artikel Blog'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts && posts.length > 0 ? (
          posts.map((post: any) => (
            <div key={post.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-2">{post.title}</h2>
              <p className="text-gray-400 text-sm">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(lang) : 'No date'}
              </p>
              <p className="text-gray-300 mt-4 line-clamp-3">{post.content}</p>
            </div>
          ))
        ) : (
          <p className="text-white text-center col-span-full">
            {lang === 'en' ? 'No blog posts found.' : 'Tidak ada artikel blog ditemukan.'}
          </p>
        )}
      </div>
    </main>
  );
}
