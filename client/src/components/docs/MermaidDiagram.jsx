/**
 * @file components/docs/MermaidDiagram.jsx
 * @description Renders Mermaid diagram from definition string.
 * Uses mermaid if available; otherwise shows copyable code block.
 */

import { useEffect, useState } from 'react';
import { CodeBlock } from './CodeBlock.jsx';

export function MermaidDiagram({ chart, title }) {
  const [svg, setSvg] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chart) return;

    const render = async () => {
      try {
        setLoading(true);
        const mermaid = (await import('mermaid')).default;
        
        // Initialize mermaid with proper config
        await mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        });

        // Create a unique ID and render
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        
        // Render the diagram
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        setSvg(renderedSvg);
        setError(null);
      } catch (err) {
        console.error('[mermaid] Render error:', err?.message);
        setError('Unable to render diagram');
        setSvg(null);
      } finally {
        setLoading(false);
      }
    };

    render();
  }, [chart]);

  return (
    <div className="my-4 rounded-lg border border-border bg-card/30 p-4 overflow-x-auto">
      {title && <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>}
      
      {error ? (
        <div className="text-red-500 text-sm p-2 bg-red-950/20 rounded">
          Error: {error}
        </div>
      ) : loading ? (
        <div className="flex justify-center min-h-[200px] items-center">
          <p className="text-muted-foreground text-sm">Loading diagram...</p>
        </div>
      ) : svg ? (
        <div 
          className="flex justify-center [&_svg]:max-w-full [&_svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : null}
    </div>
  );
}
