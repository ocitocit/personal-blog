import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { author, content, postId } = body;

    // Validasi dasar
    if (!author || !content || !postId) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Kirim data ke Strapi
    const strapiUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/comments`;
    const res = await fetch(strapiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          author: author,
          content: content,
          blog_post: postId,
        },
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: 'Failed to post comment to Strapi.', details: errorData },
        { status: res.status },
      );
    }

    const newComment = await res.json();
    return NextResponse.json({ message: 'Comment posted successfully!', comment: newComment }, { status: 201 });
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
