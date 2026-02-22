/**
 * @file components/simulator/SimulatorLogs.jsx
 * @description Live scrollable event log display with styled scrollbar.
 */

import { useRef, useEffect } from 'react';
import { useSimulatorStore } from '../../store/simulatorStore.js';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';
import { cn } from '../../lib/utils.js';

const typeStyles = {
  allowed: 'text-emerald-400',
  blocked: 'text-red-400',
  failed: 'text-amber-400',
  info: 'text-blue-400',
  error: 'text-red-400',
};

export function SimulatorLogs() {
  const eventsLog = useSimulatorStore((s) => s.eventsLog);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [eventsLog]);

  return (
    <Card className="border-border/40 flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Event Log</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Live events (max {eventsLog.length}/500)
            </p>
          </div>
          {eventsLog.length > 0 && (
            <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
              {eventsLog.length} events
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto rounded-lg border border-border/40 bg-card/50 p-4 font-mono text-xs"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'hsl(var(--muted)) hsl(var(--background))',
          }}
        >
          {eventsLog.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Start a simulation to see live events</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {eventsLog.map((ev) => (
                <div
                  key={ev.id}
                  className={cn(
                    'truncate transition-colors hover:text-foreground',
                    typeStyles[ev.type] || 'text-muted-foreground'
                  )}
                  title={ev.message}
                >
                  <span className="text-muted-foreground">[{ev.type}]</span> {ev.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
