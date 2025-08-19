'use client';

import { useState, FormEvent } from 'react';

type CommentFormProps = {
  postId: number;
};

export default function CommentForm({ postId }: CommentFormProps) {
  const [formData, setFormData] = useState({ author: '', content: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setResponseMessage('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, postId: postId }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setResponseMessage(data.message);
        setFormData({ author: '', content: '' }); // Bersihkan formulir
        // Opsional: Muat ulang komentar atau perbarui UI
      } else {
        setStatus('error');
        setResponseMessage(data.error || 'Failed to post comment.');
      }
    } catch (error) {
      setStatus('error');
      setResponseMessage('Failed to send comment. Please try again later.');
    }
  };

  return (
    <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Leave a Comment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="author" className="block text-gray-300">
            Name
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-gray-300">
            Comment
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={4}
            required
            className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-gray-500"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Posting...' : 'Post Comment'}
        </button>
        {responseMessage && (
          <p className={`text-center font-semibold ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {responseMessage}
          </p>
        )}
      </form>
    </div>
  );
}
