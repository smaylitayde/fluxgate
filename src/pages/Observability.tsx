import { useState, useEffect } from 'react'
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

function generateObs(points = 60) {
  return Array.from({ length: points }, (_, i) => ({
    t: i,
    p50: 7 + Math.random() * 3,
    p95: 13 + Math.random() * 5,
    p99: 21 + Math.random() * 7,
    grpcRps: 7600 + Math.random() * 900,
    restRps: 3800 + Math.random() * 500,
    cpu: 38 + Math.random() * 12,
    memory: 440 + Math.random() * 80,
    errors: 0.008 + Math.random() * 0.025,
  }))
}

const services = ['All services', 'order-service', 'payment-service', 'inventory-service', 'user-service']
const protocols = ['All protocols', 'gRPC', 'REST']
const endpoints = ['All endpoints', 'POST /orders/checkout', 'GET /users/profile', 'POST /inventory/reserve']
const timeRanges = ['5m', '15m', '1h', '6h', '24h']

const statCards = [
  { label: 'p50 Latency', key: 'p50', suffix: ' ms', color: 'var(--color-green)' },
  { label: 'p95 Latency', key: 'p95', suffix: ' ms', color: 'var(--color-cyan)' },
  { label: 'p99 Latency', key: 'p99', suffix: ' ms', color: 'var(--color-amber)' },
  { label: 'Error Rate', key: 'errors', suffix: '%', decimals: 3, color: 'var(--color-red)' },
]

export default function Observability() {
  const [data, setData] = useState(generateObs(60))
  const [service, setService] = useState('All services')
  const [protocol, setProtocol] = useState('All protocols')
  const [endpoint, setEndpoint] = useState('All endpoints')
  const [range, setRange] = useState('15m')

  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1]
        return [
          ...prev.slice(-59),
          {
            t: last.t + 1,
            p50: 7 + Math.random() * 3,
            p95: 13 + Math.random() * 5,
            p99: 21 + Math.random() * 7,
            grpcRps: 7600 + Math.random() * 900,
            restRps: 3800 + Math.random() * 500,
            cpu: 38 + Math.random() * 12,
            memory: 440 + Math.random() * 80,
            errors: 0.008 + Math.random() * 0.025,
          },
        ]
      })
    }, 2000)
    return () => clearInterval(id)
  }, [])

  const latest = data[data.length - 1]

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        <div className="flex items-start justify-between">
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
              Observability
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', marginTop: 4 }}>
              Real-time protocol metrics across all services.
            </p>
          </div>
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { value: service, options: services, onChange: setService },
              { value: protocol, options: protocols, onChange: setProtocol },
              { value: endpoint, options: endpoints, onChange: setEndpoint },
            ].map(({ value, options, onChange }, i) => (
              <select
                key={i}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 4,
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  padding: '5px 8px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {options.map((o) => <option key={o}>{o}</option>)}
              </select>
            ))}
            <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
              {timeRanges.map((r) => (
                <button key={r} onClick={() => setRange(r)} style={{
                  padding: '5px 10px',
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  background: range === r ? 'var(--color-card-alt)' : 'transparent',
                  color: range === r ? 'var(--color-text)' : 'var(--color-text-dim)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}>{r}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--color-border)', borderRadius: 6, overflow: 'hidden' }}>
          {statCards.map(({ label, key, suffix, decimals = 1, color }) => (
            <div key={label} style={{ background: 'var(--color-card)', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.625rem', letterSpacing: '0.1em', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
                {label.toUpperCase()}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color, fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {(latest[key as keyof typeof latest] as number).toFixed(decimals)}{suffix}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            {
              title: 'Latency Percentiles (ms)',
              lines: [
                { key: 'p50', name: 'p50', color: '#10b981' },
                { key: 'p95', name: 'p95', color: '#00d4ff' },
                { key: 'p99', name: 'p99', color: '#f59e0b' },
              ],
            },
            {
              title: 'Throughput (req/s)',
              lines: [
                { key: 'grpcRps', name: 'gRPC', color: '#00d4ff' },
                { key: 'restRps', name: 'REST', color: '#f59e0b' },
              ],
            },
            {
              title: 'CPU Utilization (%)',
              lines: [{ key: 'cpu', name: 'CPU %', color: '#00d4ff' }],
            },
            {
              title: 'Memory (MB)',
              lines: [{ key: 'memory', name: 'Memory MB', color: '#10b981' }],
            },
          ].map(({ title, lines }) => (
            <div key={title} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6 }}>
              <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)' }}>{title}</h4>
              </div>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="t" tick={{ fontSize: 9, fill: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={{ stroke: 'var(--color-border)' }} interval={14} />
                    <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} width={32} />
                    <Tooltip contentStyle={{ background: '#1a2230', border: '1px solid var(--color-border)', borderRadius: 4, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }} />
                    {lines.map((l) => (
                      <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

        {/* Error rate */}
        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6 }}>
          <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)' }}>Error Rate (%)</h4>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="t" tick={{ fontSize: 9, fill: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={{ stroke: 'var(--color-border)' }} interval={14} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} width={32} />
                <Tooltip contentStyle={{ background: '#1a2230', border: '1px solid var(--color-border)', borderRadius: 4, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }} />
                <Area type="monotone" dataKey="errors" name="Error %" stroke="var(--color-red)" fill="rgba(239,68,68,0.08)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}
