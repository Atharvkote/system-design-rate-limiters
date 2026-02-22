/**
 * @file components/simulator/SimulatorCharts.jsx
 * @description Live charts for allowed vs blocked requests using Recharts.
 */

import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { useSimulatorStore } from '../../store/simulatorStore.js';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';

const COLORS = { allowed: '#22c55e', blocked: '#ef4444', failed: '#f59e0b' };

const TIME_RANGES = [
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '5m', value: 300 },
];

export function SimulatorCharts() {
  const chartData = useSimulatorStore((s) => s.chartData);
  const requestsSuccess = useSimulatorStore((s) => s.requestsSuccess);
  const requestsBlocked = useSimulatorStore((s) => s.requestsBlocked);
  const requestsFailed = useSimulatorStore((s) => s.requestsFailed);
  const [rangeSeconds, setRangeSeconds] = useState(60);

  const filteredData = useMemo(() => {
    if (!chartData.length) return chartData;
    const cutoff = Date.now() - rangeSeconds * 1000;
    return chartData.filter((point) => point.time >= cutoff);
  }, [chartData, rangeSeconds]);

  const barData = [
    { name: 'Allowed', value: requestsSuccess, color: COLORS.allowed },
    { name: 'Blocked', value: requestsBlocked, color: COLORS.blocked },
    { name: 'Failed', value: requestsFailed, color: COLORS.failed },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-border/40">
        <CardHeader className="pb-4">
          <div className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">Requests Over Time</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Real-time request flow visualization
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-card/50 p-1 text-xs">
              {TIME_RANGES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRangeSeconds(r.value)}
                  className={`px-3 py-1.5 rounded transition-all ${
                    rangeSeconds === r.value
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted opacity-30" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="allowed"
                  stroke={COLORS.allowed}
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                  name="Allowed"
                />
                <Line
                  type="monotone"
                  dataKey="blocked"
                  stroke={COLORS.blocked}
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                  name="Blocked"
                />
                <Line
                  type="monotone"
                  dataKey="failed"
                  stroke={COLORS.failed}
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                  name="Failed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Request Breakdown</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Cumulative totals by status
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted opacity-30" />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis type="category" dataKey="name" width={55} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
