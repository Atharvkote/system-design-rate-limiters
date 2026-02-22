/**
 * @file components/simulator/SimulatorControls.jsx
 * @description Control panel for configuring and running the rate limiter simulation.
 */

import { useState, useMemo } from 'react';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.jsx';
import { useSimulator } from '../../hooks/useSimulator.js';

const ENDPOINT_PRESETS = [
  {
    id: 'custom',
    label: 'Custom',
    description: 'Manually configure URL and method',
    method: 'GET',
    url: '',
  },
  {
    id: 'public-info',
    label: 'Public info (PUBLIC)',
    description: 'GET /api/v1/public/info',
    method: 'GET',
    url: 'http://localhost:5000/api/v1/public/info',
  },
  {
    id: 'public-status',
    label: 'Public status (PUBLIC)',
    description: 'GET /api/v1/public/status',
    method: 'GET',
    url: 'http://localhost:5000/api/v1/public/status',
  },
  {
    id: 'user-me',
    label: 'User profile (READ)',
    description: 'GET /api/v1/users/me (requires x-user-id)',
    method: 'GET',
    url: 'http://localhost:5000/api/v1/users/me',
  },
  {
    id: 'resource-read',
    label: 'Resource read (READ)',
    description: 'GET /api/v1/resources/:id',
    method: 'GET',
    url: 'http://localhost:5000/api/v1/resources/demo-id',
  },
  {
    id: 'resource-write',
    label: 'Resource create (WRITE)',
    description: 'POST /api/v1/resources',
    method: 'POST',
    url: 'http://localhost:5000/api/v1/resources',
  },
  {
    id: 'resource-heavy',
    label: 'Heavy process (HEAVY)',
    description: 'POST /api/v1/resources/:id/process',
    method: 'POST',
    url: 'http://localhost:5000/api/v1/resources/demo-id/process',
  },
  {
    id: 'upload',
    label: 'Upload (UPLOAD)',
    description: 'POST /api/v1/upload',
    method: 'POST',
    url: 'http://localhost:5000/api/v1/upload',
  },
  {
    id: 'auth-login',
    label: 'Auth login (AUTH)',
    description: 'POST /api/v1/auth/login',
    method: 'POST',
    url: 'http://localhost:5000/api/v1/auth/login',
  },
];

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const MODES = [
  { value: 'constant', label: 'Constant rate' },
  { value: 'burst', label: 'Burst mode' },
  { value: 'spike', label: 'Spike mode' },
];

export function SimulatorControls() {
  const { isRunning, startSimulation, stopSimulation, resetSimulation } = useSimulator();
  const [presetId, setPresetId] = useState('public-info');
  const [targetUrl, setTargetUrl] = useState('http://localhost:5000/api/v1/public/info');
  const [method, setMethod] = useState('GET');
  const [requestsPerSecond, setRequestsPerSecond] = useState(20);
  const [totalRequests, setTotalRequests] = useState(200);
  const [concurrency, setConcurrency] = useState(10);
  const [mode, setMode] = useState('constant');
  const [userId, setUserId] = useState('');
  const [apiKey, setApiKey] = useState('');

  const activePreset = useMemo(
    () => ENDPOINT_PRESETS.find((p) => p.id === presetId) ?? ENDPOINT_PRESETS[0],
    [presetId]
  );

  const applyPreset = (id) => {
    setPresetId(id);
    const preset = ENDPOINT_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    if (preset.url) setTargetUrl(preset.url);
    if (preset.method) setMethod(preset.method);
  };

  const handleStart = () => {
    const headers = {};
    if (userId.trim()) headers['x-user-id'] = userId.trim();
    if (apiKey.trim()) headers['x-api-key'] = apiKey.trim();

    startSimulation({
      targetUrl: targetUrl.trim(),
      method,
      requestsPerSecond: Math.max(1, Math.min(200, requestsPerSecond)),
      totalRequests: Math.max(1, Math.min(10000, totalRequests)),
      concurrency: Math.max(1, Math.min(50, concurrency)),
      mode,
      headers,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2 sm:col-span-2 lg:col-span-3">
          <Label htmlFor="preset">Endpoint preset</Label>
          <Select
            value={presetId}
            onValueChange={(value) => applyPreset(value)}
            disabled={isRunning}
          >
            <SelectTrigger id="preset">
              <SelectValue placeholder="Select endpoint" />
            </SelectTrigger>
            <SelectContent>
              {ENDPOINT_PRESETS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {activePreset?.description && (
            <p className="text-xs text-muted-foreground">{activePreset.description}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="target-url">Target URL</Label>
          <Input
            id="target-url"
            placeholder="http://localhost:5000/api/v1/public/info"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            disabled={isRunning}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="method">Method</Label>
          <Select value={method} onValueChange={setMethod} disabled={isRunning}>
            <SelectTrigger id="method">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {METHODS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mode">Simulation Mode</Label>
          <Select value={mode} onValueChange={setMode} disabled={isRunning}>
            <SelectTrigger id="mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODES.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rps">Requests per second</Label>
          <Input
            id="rps"
            type="number"
            min={1}
            max={200}
            value={requestsPerSecond}
            onChange={(e) => setRequestsPerSecond(Number(e.target.value) || 10)}
            disabled={isRunning}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="total">Total requests</Label>
          <Input
            id="total"
            type="number"
            min={1}
            max={10000}
            value={totalRequests}
            onChange={(e) => setTotalRequests(Number(e.target.value) || 100)}
            disabled={isRunning}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="concurrency">Concurrency</Label>
          <Input
            id="concurrency"
            type="number"
            min={1}
            max={50}
            value={concurrency}
            onChange={(e) => setConcurrency(Number(e.target.value) || 5)}
            disabled={isRunning}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="user-id">x-user-id (for user rate limits)</Label>
          <Input
            id="user-id"
            placeholder="e.g. user-123 or admin"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            disabled={isRunning}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="api-key">x-api-key (optional)</Label>
          <Input
            id="api-key"
            placeholder="api key for api-based limits"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            disabled={isRunning}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          onClick={handleStart}
          disabled={isRunning}
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold"
        >
          ▶ Start Simulation
        </Button>
        <Button
          variant="destructive"
          onClick={stopSimulation}
          disabled={!isRunning}
          className="font-semibold"
        >
          ⏹ Stop Simulation
        </Button>
        <Button
          variant="outline"
          onClick={resetSimulation}
          disabled={isRunning}
          className="font-semibold"
        >
          ↺ Reset
        </Button>
      </div>
    </div>
  );
}
