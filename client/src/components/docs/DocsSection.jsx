/**
 * @file components/docs/DocsSection.jsx
 * @description Reusable documentation section with id for scroll navigation.
 */

import { forwardRef } from 'react';

export const DocsSection = forwardRef(({ id, title, children, className = '' }, ref) => (
  <section
    ref={ref}
    id={id}
    className={`scroll-mt-24 pb-12 ${className}`}
  >
    <h2 className="text-2xl font-bold tracking-tight mb-4 pb-2 border-b border-border">
      {title}
    </h2>
    <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
      {children}
    </div>
  </section>
));
DocsSection.displayName = 'DocsSection';
