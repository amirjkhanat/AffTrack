'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface LandingPageContent {
  html: string;
  css: string;
  name: string;
  parameters: any;
  baseUrl: string;
}

export default function LandingPageView() {
  const params = useParams();
  const [content, setContent] = useState<LandingPageContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, [params.id]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/landing-pages/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to load landing page');
      }
      const data = await response.json();
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load landing page');
    }
  };

  const handleShare = async () => {
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content.baseUrl);
      toast.success('URL copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">{content.name}</h1>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <Share2 size={20} />
            Share URL
          </button>
        </div>
      </div>
      <div className="pt-16">
        <style>{content.css}</style>
        <div dangerouslySetInnerHTML={{ __html: content.html }} />
      </div>
    </div>
  );
} 