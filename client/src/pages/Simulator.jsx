/**
 * @file pages/Simulator.jsx
 * @description Main simulator dashboard page assembling all simulator components.
 */

import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { SimulatorControls } from '../components/simulator/SimulatorControls.jsx';
import { SimulatorStats } from '../components/simulator/SimulatorStats.jsx';
import { SimulatorCharts } from '../components/simulator/SimulatorCharts.jsx';
import { SimulatorLogs } from '../components/simulator/SimulatorLogs.jsx';
import { SimulatorStatus } from '../components/simulator/SimulatorStatus.jsx';
import { SocketSimulator } from '../components/simulator/SocketSimulator.jsx';

export function Simulator() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}

      <main className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Controls Section */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Simulation Controls</h2>
            <p className="text-sm text-muted-foreground">Configure and run your load test</p>
          </div>
          <SimulatorControls />
        </section>

        {/* Statistics Section */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Real-time Statistics</h2>
            <p className="text-sm text-muted-foreground">Monitor request metrics and performance</p>
          </div>
          <SimulatorStats />
        </section>

        {/* Charts Section */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Visualization</h2>
            <p className="text-sm text-muted-foreground">Track rate limiter behavior patterns</p>
          </div>
          <SimulatorCharts />
        </section>

        {/* Logs and Status Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Event Log</h2>
              <p className="text-sm text-muted-foreground">Live request events</p>
            </div>
            <SimulatorLogs />
          </div>
          <div className="space-y-6">
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Connection Status</h2>
                <p className="text-sm text-muted-foreground">WebSocket connection state</p>
              </div>
              <SimulatorStatus />
            </div>
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Socket.IO Simulator</h2>
                <p className="text-sm text-muted-foreground">Real-time messaging</p>
              </div>
              <SocketSimulator />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
