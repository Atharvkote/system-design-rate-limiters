/**
 * @file pages/Dashboard.jsx
 * @description Overview dashboard with quick links to simulator.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Zap, Server } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';

export function Dashboard() {
  const [health, setHealth] = useState({ status: 'unknown', uptimeSeconds: 0, error: null });

  useEffect(() => {
    let cancelled = false;

    const fetchHealth = async () => {
      try {
        const res = await fetch('http://localhost:5000/health');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setHealth({
            status: data.status || 'ok',
            uptimeSeconds: data.uptimeSeconds ?? 0,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setHealth({
            status: 'down',
            uptimeSeconds: 0,
            error: err.message || 'Request failed',
          });
        }
      }
    };

    fetchHealth();
    const id = setInterval(fetchHealth, 10000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background max-w-7xl mx-auto px-4">
      {/* Header */}
      <main className="container mx-auto px-4 py-12">
        {/* Quick Stats */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-4">System Status</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border/40">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Backend Server</CardTitle>
                  <Server className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block h-3 w-3 rounded-full ${health.status === 'ok'
                          ? 'bg-emerald-500'
                          : health.status === 'unknown'
                            ? 'bg-amber-400'
                            : 'bg-red-500'
                        }`}
                    />
                    <span className="text-sm">
                      Status:{' '}
                      <span className="font-semibold">
                        {health.status === 'ok'
                          ? 'Healthy'
                          : health.status === 'down'
                            ? 'Down'
                            : 'Checking'}
                      </span>
                    </span>
                  </div>
                  {health.status === 'ok' && (
                    <p className="text-sm text-muted-foreground">
                      Uptime: <span className="font-medium">{Math.round(health.uptimeSeconds)}s</span>
                    </p>
                  )}
                  {health.error && (
                    <p className="text-xs text-red-400">Error: {health.error}</p>
                  )}
                </div>
                <a
                  href="http://localhost:5000/health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:text-accent transition"
                >
                  View /health endpoint →
                </a>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">API Connection</CardTitle>
                  <Zap className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">localhost:5000</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    {health.status === 'ok' ? 'Connected' : 'Disconnected'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Ready for load testing
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Tools</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/40 hover:border-primary/30 hover:bg-card/60 transition-all duration-200 cursor-pointer group">
              <Link to="/simulator" className="block h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="group-hover:text-primary transition">Simulator</CardTitle>
                      <CardDescription>
                        Test API rate limiting behavior
                      </CardDescription>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition transform group-hover:translate-x-1" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Generate high-throughput requests, visualize rate limiter behavior, and test various traffic patterns in real time.
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>✓ Real-time metrics & charts</li>
                      <li>✓ Multiple simulation modes</li>
                      <li>✓ Live event logging</li>
                    </ul>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="border-border/40 hover:border-primary/30 hover:bg-card/60 transition-all duration-200 cursor-pointer group">
              <Link to="/docs" className="block h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="group-hover:text-primary transition">Documentation</CardTitle>
                      <CardDescription>
                        Learn about rate limiting
                      </CardDescription>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition transform group-hover:translate-x-1" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Full reference: backend architecture, Redis integration, rate limiting strategies, and simulator logic.
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      View Docs <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-12 border-t border-border/40">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Quick Access</h3>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/simulator">Open Simulator</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/docs">View Docs</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="http://localhost:5000/health" target="_blank" rel="noopener noreferrer">Health Check</a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
