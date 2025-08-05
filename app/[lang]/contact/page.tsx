// app/[lang]/contact/page.tsx

export default async function ContactPage({ params }: { params: { lang: string } }) {
  const isEnglish = params.lang === 'en';

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">{isEnglish ? 'Contact Us' : 'Hubungi Kami'}</h1>
      <p>
        {isEnglish ? 'You can reach us at contact@example.com' : 'Anda dapat menghubungi kami di contact@example.com'}
      </p>
    </main>
  );
}
