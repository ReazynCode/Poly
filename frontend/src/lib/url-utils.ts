export type ContentType = 'youtube' | 'article' | 'pdf' | 'github' | 'link';

interface UrlMetadata {
  type: ContentType;
  label: string;
  icon: string;
  favicon: string;
  thumbnailUrl?: string;
  videoId?: string | null;
}

export function parseUrl(url: string): UrlMetadata | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    // YouTube
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      const videoId = extractYouTubeId(url);
      return {
        type: 'youtube',
        label: 'YouTube',
        icon: '▶️',
        favicon: 'https://www.youtube.com/favicon.ico',
        thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : undefined,
        videoId,
      };
    }

    // GitHub
    if (hostname.includes('github.com')) {
      return {
        type: 'github',
        label: 'GitHub',
        icon: '💻',
        favicon: 'https://github.com/favicon.ico',
      };
    }

    // PDF (by extension)
    if (parsed.pathname.toLowerCase().endsWith('.pdf')) {
      return {
        type: 'pdf',
        label: 'PDF',
        icon: '📄',
        favicon: getFaviconUrl(hostname),
      };
    }

    // Default: article/link
    return {
      type: 'article',
      label: getDisplayDomain(hostname),
      icon: '📖',
      favicon: getFaviconUrl(hostname),
    };
  } catch {
    return null;
  }
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getFaviconUrl(hostname: string): string {
  return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
}

function getDisplayDomain(hostname: string): string {
  return hostname.replace(/^www\./, '').split('.')[0];
}
