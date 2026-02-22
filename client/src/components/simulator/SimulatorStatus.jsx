/**
 * @file components/simulator/SimulatorStatus.jsx
 * @description Limiter status, connection state, and current RPS.
 */

import { useSimulatorStore } from '../../store/simulatorStore.js';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';
import { cn } from '../../lib/utils.js';

export function SimulatorStatus() {
  const remainingTokens = useSimulatorStore((s) => s.remainingTokens);
  const resetTime = useSimulatorStore((s) => s.resetTime);
  const currentRps = useSimulatorStore((s) => s.currentRps);
  const socketConnected = useSimulatorStore((s) => s.socketConnected);

  const resetLabel = resetTime != null
    ? new Date(resetTime).toLocaleTimeString()
    : '—';

  return (
    <Card className="border-border/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Limiter Status</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Real-time rate limiter state
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-3 rounded-lg bg-card/50 border border-border/40">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">Remaining Tokens</p>
            <p className="text-2xl font-bold">{remainingTokens}</p>
          </div>
          <div className="p-3 rounded-lg bg-card/50 border border-border/40">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">Reset Time</p>
            <p className="text-sm font-semibold">{resetLabel}</p>
          </div>
          <div className="p-3 rounded-lg bg-card/50 border border-border/40">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">Current RPS</p>
            <p className="text-2xl font-bold">{currentRps.toFixed(1)}</p>
          </div>
          <div className={cn(
            'p-3 rounded-lg border',
            socketConnected
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-amber-500/10 border-amber-500/30'
          )}>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">Connection</p>
            <p className={cn(
              'text-sm font-bold flex items-center gap-2',
              socketConnected ? 'text-emerald-400' : 'text-amber-400'
            )}>
              <span className={cn(
                'w-2 h-2 rounded-full',
                socketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              )} />
              {socketConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
          Rate limit tokens update from Socket.IO events or HTTP 429 responses. Reset time indicates when the limit window resets.
        </p>
      </CardContent>
    </Card>
  );
}
