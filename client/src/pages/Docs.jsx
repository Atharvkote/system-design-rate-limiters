/**
 * @file pages/Docs.jsx
 * @description Full documentation page with sidebar, search, and scroll spy.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { DocsSidebar } from '../components/docs/DocsSidebar.jsx';
import { DocsContent } from '../components/docs/DocsContent.jsx';

export function Docs() {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const contentRef = useRef(null);
  const sectionElements = useRef(new Map());

  const registerSection = useCallback((id, el) => {
    if (el) {
      sectionElements.current.set(id, el);
    } else {
      sectionElements.current.delete(id);
    }
  }, []);

  useEffect(() => {
    const updateActive = () => {
      const viewportTop = window.scrollY + 120;
      let best = null;
      let bestTop = -Infinity;
      sectionElements.current.forEach((el, id) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        if (top <= viewportTop && top > bestTop) {
          bestTop = top;
          best = id;
        }
      });
      if (best) setActiveSection(best);
    };

    const raf = requestAnimationFrame(() => updateActive());
    window.addEventListener('scroll', updateActive, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', updateActive);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background max-w-7xl mx-auto px-4">

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <DocsSidebar
            activeSection={activeSection}
            onSearch={setSearchQuery}
            searchQuery={searchQuery}
          />
          <div ref={contentRef} className="flex-1 min-w-0 max-w-4xl">
            <DocsContent registerSection={registerSection} />
          </div>
        </div>
      </main>
    </div>
  );
}
