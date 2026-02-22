/**
 * @file components/simulator/SocketSimulator.jsx
 * @description Simple Socket.IO load simulator for emitting events.
 */

import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button.jsx';
import { Label } from '../ui/label.jsx';
import { Input } from '../ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.jsx';
import { getSocket } from '../../services/socketService.js';
import { useSimulatorStore } from '../../store/simulatorStore.js';
import { formatTime } from '../../utils/timeUtils.js';

const SOCKET_EVENTS = [
  { value: 'chat:message', label: 'chat:message' },
  { value: 'chat:typing', label: 'chat:typing' },
  { value: 'notifications:pull', label: 'notifications:pull' },
];

export function SocketSimulator() {
  const [eventName, setEventName] = useState('chat:message');
  const [payload, setPayload] = useState('{"message":"hello from simulator"}');
  const [rps, setRps] = useState(20);
  const [total, setTotal] = useState(200);
  const [running, setRunning] = useState(false);
  const sentRef = useRef(0);
  const intervalRef = useRef(null);
  const addEvent = useSimulatorStore((s) => s.addEvent);

  useEffect(
    () => () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    },
    []
  );

  const emitOnce = () => {
    const socket = getSocket();
    if (!socket || !socket.connected) {
      addEvent({
        type: 'error',
        message: `[${formatTime()}] Socket not connected — cannot emit`,
        timestamp: Date.now(),
      });
      return;
    }

    let data;
    try {
      data = payload ? JSON.parse(payload) : {};
    } catch {
      data = { raw: payload };
    }

    socket.emit(eventName, data, () => {
      addEvent({
        type: 'info',
        message: `[${formatTime()}] Emitted ${eventName}`,
        timestamp: Date.now(),
      });
    });
  };

  const startLoad = () => {
    const socket = getSocket();
    if (!socket || !socket.connected) {
      addEvent({
        type: 'error',
        message: `[${formatTime()}] Socket not connected — cannot start socket load`,
        timestamp: Date.now(),
      });
      return;
    }
    if (running) return;

    sentRef.current = 0;
    setRunning(true);

    const batchSize = Math.max(1, Math.floor(rps / 4));
    const intervalMs = batchSize > 0 ? 250 : 1000;

    intervalRef.current = setInterval(() => {
      if (sentRef.current >= total) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setRunning(false);
        addEvent({
          type: 'info',
          message: `[${formatTime()}] Socket load complete — sent ${sentRef.current} events`,
          timestamp: Date.now(),
        });
        return;
      }

      const remaining = total - sentRef.current;
      const toSend = Math.min(batchSize, remaining);

      let data;
      try {
        data = payload ? JSON.parse(payload) : {};
      } catch {
        data = { raw: payload };
      }

      for (let i = 0; i < toSend; i += 1) {
        socket.emit(eventName, data);
        sentRef.current += 1;
      }
    }, intervalMs);

    addEvent({
      type: 'info',
      message: `[${formatTime()}] Starting socket load: ${eventName}, RPS≈${rps}, Total=${total}`,
      timestamp: Date.now(),
    });
  };

  const stopLoad = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (running) {
      setRunning(false);
      addEvent({
        type: 'info',
        message: `[${formatTime()}] Socket load stopped manually`,
        timestamp: Date.now(),
      });
    }
  };

  return (
    <div className="p-4 rounded-lg border border-border/40 bg-card/50 space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="socket-event" className="text-xs font-semibold uppercase">Event</Label>
          <Select value={eventName} onValueChange={setEventName} disabled={running}>
            <SelectTrigger id="socket-event" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SOCKET_EVENTS.map((e) => (
                <SelectItem key={e.value} value={e.value}>
                  {e.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="socket-rps" className="text-xs font-semibold uppercase">Events/sec</Label>
          <Input
            id="socket-rps"
            type="number"
            min={1}
            max={200}
            value={rps}
            onChange={(e) => setRps(Number(e.target.value) || 10)}
            disabled={running}
            className="h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="socket-total" className="text-xs font-semibold uppercase">Total</Label>
          <Input
            id="socket-total"
            type="number"
            min={1}
            max={10000}
            value={total}
            onChange={(e) => setTotal(Number(e.target.value) || 100)}
            disabled={running}
            className="h-9"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="socket-payload" className="text-xs font-semibold uppercase">Payload</Label>
        <Input
          id="socket-payload"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          disabled={running}
          className="font-mono text-xs h-9"
        />
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <Button type="button" variant="secondary" size="sm" onClick={emitOnce} disabled={running}>
          Send Once
        </Button>
        <Button type="button" size="sm" onClick={startLoad} disabled={running}>
          Start Load
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={stopLoad} disabled={!running}>
          Stop
        </Button>
      </div>
    </div>
  );
}

