/**
 * @file components/docs/CodeBlock.jsx
 * @description Code block with syntax highlighting and copy-to-clipboard button.
 */

import { useState, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { cn } from '../../lib/utils.js';

export function CodeBlock({ code, language = 'javascript', className = '' }) {
  const [copied, setCopied] = useState(false);
  const [highlighted, setHighlighted] = useState('');

  useEffect(() => {
    try {
      const lang = hljs.getLanguage(language) ? language : 'plaintext';
      const result = hljs.highlight(code, { language: lang, ignoreIllegals: true });
      setHighlighted(result.value);
    } catch (err) {
      console.error('Syntax highlighting error:', err);
      setHighlighted(code);
    }
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
    }
  };

  return (
    <div className={cn('relative group rounded-lg overflow-hidden', className)}>
      <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border text-xs text-muted-foreground">
        <span className="uppercase">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-muted transition"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm bg-card/50 border border-t-0 border-border hljs">
        <code
          className="font-mono"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}
