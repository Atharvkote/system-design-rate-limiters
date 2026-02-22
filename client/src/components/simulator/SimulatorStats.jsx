/**
 * @file components/simulator/SimulatorStats.jsx
 * @description Real-time statistics display for the simulator.
 */

import { useSimulatorStore } from '../../store/simulatorStore.js';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';
import { cn } from '../../lib/utils.js';

const StatCard = ({ title, value, subtitle, variant = 'default', icon: Icon }) => (
  <Card className={cn(
    'border-border/40 hover:border-primary/30 transition-colors',
    variant === 'success' && 'border-emerald-500/30 bg-emerald-500/5',
    variant === 'destructive' && 'border-red-500/30 bg-red-500/5',
    variant === 'warning' && 'border-amber-500/30 bg-amber-500/5'
  )}>
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
      {subtitle && <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>}
    </CardContent>
  </Card>
);

export function SimulatorStats() {
  const requestsSent = useSimulatorStore((s) => s.requestsSent);
  const requestsSuccess = useSimulatorStore((s) => s.requestsSuccess);
  const requestsBlocked = useSimulatorStore((s) => s.requestsBlocked);
  const requestsFailed = useSimulatorStore((s) => s.requestsFailed);
  const currentRps = useSimulatorStore((s) => s.currentRps);
  const isRunning = useSimulatorStore((s) => s.isRunning);
  const avgResponseTime = useSimulatorStore((s) => s.avgResponseTime);

  const successRate = requestsSent > 0 ? ((requestsSuccess / requestsSent) * 100).toFixed(1) : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        title="Total Sent"
        value={requestsSent.toLocaleString()}
        subtitle="Requests dispatched"
      />
      <StatCard
        title="Allowed"
        value={requestsSuccess.toLocaleString()}
        subtitle="2xx responses"
        variant="success"
      />
      <StatCard
        title="Blocked"
        value={requestsBlocked.toLocaleString()}
        subtitle="429 rate limited"
        variant="destructive"
      />
      <StatCard
        title="Failed"
        value={requestsFailed.toLocaleString()}
        subtitle="Errors / timeouts"
        variant="warning"
      />
      <StatCard
        title="Current RPS"
        value={currentRps.toFixed(1)}
        subtitle="Requests per second"
      />
      <StatCard
        title="Success Rate"
        value={`${successRate}%`}
        subtitle={avgResponseTime > 0 ? `Avg: ${avgResponseTime.toFixed(0)}ms` : isRunning ? 'Running...' : 'Stopped'}
        variant={isRunning ? 'success' : 'default'}
      />
    </div>
  );
}
