/**
 * @file components/docs/DocsSidebar.jsx
 * @description Sticky sidebar navigation for documentation.
 */

import { Link } from 'react-router-dom';
import { Search, BookOpen, ArrowLeft } from 'lucide-react';
import { Input } from '../ui/input.jsx';
import { cn } from '../../lib/utils.js';

export const DOC_SECTIONS = [
  { id: 'overview', label: 'Overview', keywords: 'overview rate limiting introduction' },
  { id: 'architecture', label: 'System Architecture', keywords: 'architecture diagram system' },
  { id: 'frontend-arch', label: 'Frontend Simulator', keywords: 'frontend simulator react' },
  { id: 'backend-arch', label: 'Backend Architecture', keywords: 'backend express server' },
  { id: 'redis', label: 'Redis Integration', keywords: 'redis state store' },
  { id: 'strategies', label: 'Rate Limiting Strategies', keywords: 'strategies algorithms' },
  { id: 'token-bucket', label: 'Token Bucket', keywords: 'token bucket' },
  { id: 'leaky-bucket', label: 'Leaky Bucket', keywords: 'leaky bucket' },
  { id: 'fixed-window', label: 'Fixed Window', keywords: 'fixed window' },
  { id: 'sliding-window', label: 'Sliding Window', keywords: 'sliding window' },
  { id: 'distributed', label: 'Distributed Limiting', keywords: 'distributed redis' },
  { id: 'socket-limiter', label: 'Socket.IO Rate Limiting', keywords: 'socket io websocket' },
  { id: 'code-examples', label: 'Code Examples', keywords: 'code examples' },
  { id: 'limiter-middleware', label: 'Limiter Middleware', keywords: 'middleware limiter' },
  { id: 'simulator-engine', label: 'Simulator Engine', keywords: 'simulator engine batching' },
  { id: 'rate-limiter', label: 'Rate Limiter Configuration', keywords: 'configuration points duration blockDuration' },
  { id: 'sensitivity', label: 'Sensitivity Tuning', keywords: 'sensitivity profiles strict normal relaxed' },
  { id: 'advanced-strategies', label: 'Advanced Strategies', keywords: 'tier burst adaptive cost-based' },
  { id: 'response-handling', label: 'Response Headers', keywords: 'response headers retry-after x-ratelimit' },
  { id: 'implementation-best-practices', label: 'Best Practices', keywords: 'best practices fail open logging monitoring' },
  { id: 'common-patterns', label: 'Common Patterns', keywords: 'patterns gateway per-endpoint tier two-tier' },
  { id: 'monitoring', label: 'Monitoring & Alerting', keywords: 'monitoring alerting metrics' },
  { id: 'troubleshooting', label: 'Troubleshooting', keywords: 'troubleshooting errors redis latency' },
];

export function DocsSidebar({ activeSection, onSearch, searchQuery }) {
  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <nav className="space-y-0.5">
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5" />
            Contents
          </div>
          {DOC_SECTIONS
          .filter(
            (s) =>
              !searchQuery?.trim() ||
              s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.keywords?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={cn(
                'block px-3 py-2 rounded-md text-sm transition',
                activeSection === s.id
                  ? 'bg-primary/20 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
