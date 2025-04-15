"use client";
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Copy } from 'lucide-react';

export default function LandingPagePreview() {
  const { id } = useParams();
  const router = useRouter();
  const [html, setHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    fetch(`/api/landing-pages/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load landing page');
        const data = await res.json();
        setHtml(data.html || '');
        setPageUrl(window.location.origin + `/l/${id}`);
      })
      .catch(() => setError('Failed to load landing page'))
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    // Вставляем HTML и стили в iframe
    if (iframeRef.current && html) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html]);

  const handleCopy = () => {
    if (pageUrl) {
      navigator.clipboard.writeText(pageUrl);
    }
  };

  const handleEdit = () => {
    router.push(`/landing-pages?pageId=${id}&edit=1`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this landing page?')) return;
    await fetch(`/api/landing-pages/${id}`, { method: 'DELETE' });
    router.push('/assets/landing-pages');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading landing page...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div
        className="flex gap-2 p-3 border-b bg-card/80 dark:bg-card/60 sticky top-0 z-10 shadow-sm rounded-b-lg backdrop-blur supports-[backdrop-filter]:bg-card/60 justify-end"
        style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}
      >
        <Button
          size="sm"
          variant="ghost"
          className="flex items-center gap-1 text-muted-foreground hover:text-primary hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring"
          onClick={handleCopy}
        >
          <Copy className="h-4 w-4" />
          <span className="hidden sm:inline">Copy Link</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="flex items-center gap-1 text-muted-foreground hover:text-primary hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring"
          onClick={handleEdit}
        >
          <Edit className="h-4 w-4" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="flex items-center gap-1 text-destructive hover:text-destructive hover:bg-destructive/10 border-none focus-visible:ring-2 focus-visible:ring-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>
      <div className="w-full h-[calc(100vh-56px)]">
        <iframe
          ref={iframeRef}
          title="Landing Page Preview"
          style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
        />
      </div>
    </div>
  );
}