// app/[lang]/page.tsx

export default async function ProfilePage({ params }: { params: { lang: string } }) {
  // Here you will fetch profile data from Strapi later

  const isEnglish = params.lang === 'en';

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">{isEnglish ? 'Profile Page' : 'Halaman Profil'}</h1>
      <section>
        <h2 className="text-2xl font-semibold mb-4">{isEnglish ? 'About Me' : 'Tentang Saya'}</h2>
        <p>
          {isEnglish
            ? 'I am a developer building my first app with Strapi and Next.js.'
            : 'Saya adalah seorang pengembang yang membangun aplikasi pertama saya dengan Strapi dan Next.js.'}
        </p>
      </section>
    </main>
  );
}
