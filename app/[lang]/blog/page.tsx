import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Pagination from '../../components/Pagination';
import SearchInput from '../../components/SearchInput'; // Impor SearchInput

async function getBlogPosts(lang: string, page: number = 1, searchTerm: string = '') {
  const searchFilter = searchTerm ? `&filters[title][$containsi]=${searchTerm}` : '';
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/blog-posts?locale=${lang}&populate=*&sort=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=5${searchFilter}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch blog posts');
  }
  const data = await res.json();
  return data;
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: { page?: string; q?: string };
}) {
  const { lang } = await params;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const searchTerm = searchParams.q || '';

  const postsData = await getBlogPosts(lang, page, searchTerm);
  const posts = postsData.data;
  const pagination = postsData.meta.pagination;

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{lang === 'en' ? 'Blog Posts' : 'Artikel Blog'}</h1>

      <SearchInput />

      <div className="space-y-8">
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <Link href={`/${lang}/blog/${post.slug}`} key={post.id}>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center transition-transform transform hover:scale-[1.01]">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-2">{post.title}</h2>
                  <p className="text-gray-400 text-sm mb-2">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString(lang, {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'No date'}
                  </p>
                  <div className="text-gray-300 markdown-content prose-base prose-invert line-clamp-3">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center text-gray-400">
            {lang === 'en' ? 'No posts found.' : 'Tidak ada artikel yang ditemukan.'}
          </div>
        )}
      </div>

      {pagination.pageCount > 1 && <Pagination page={pagination.page} pageCount={pagination.pageCount} />}
    </main>
  );
}
