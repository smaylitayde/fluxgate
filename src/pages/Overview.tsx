import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, ArrowRight, TrendingDown, TrendingUp } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import AnimatedNumber from '../components/AnimatedNumber'
import { generateTimeSeriesData } from '../data/mockData'

const statusMetrics = [
  { label: 'GATEWAY', value: 'ONLINE', mono: false, accent: true },
  { label: 'REQUESTS', valueFn: (d: ReturnType<typeof generateTimeSeriesData>) => d[d.length - 1].grpcRps, suffix: ' req/s', decimals: 0 },
  { label: 'P95 LATENCY', valueFn: (d: ReturnType<typeof generateTimeSeriesData>) => d[d.length - 1].grpcLatency, suffix: ' ms', decimals: 1 },
  { label: 'CPU', valueFn: () => 41, suffix: '%', decimals: 0 },
  { label: 'MEMORY', value: '482 MB' },
  { label: 'ERROR RATE', value: '0.02%' },
]

const comparisons = [
  {
    label: 'PAYLOAD',
    json: '4.8 KB',
    grpc: '1.9 KB',
    diff: '↓ 60.4%',
    down: true,
  },
  {
    label: 'P95 LATENCY',
    json: '31.4 ms',
    grpc: '14.8 ms',
    diff: '↓ 52.9%',
    down: true,
  },
  {
    label: 'THROUGHPUT',
    json: '4.2K req/s',
    grpc: '8.1K req/s',
    diff: '↑ 92.8%',
    down: false,
  },
  {
    label: 'CPU',
    json: '68%',
    grpc: '43%',
    diff: '↓ 36.8%',
    down: true,
  },
]

type TrafficToggle = 'json' | 'grpc' | 'both'

export default function Overview({ onRunBenchmark }: { onRunBenchmark: () => void }) {
  const [series, setSeries] = useState(generateTimeSeriesData(30))
  const [running, setRunning] = useState(true)
  const [toggle, setToggle] = useState<TrafficToggle>('both')

  const tick = useCallback(() => {
    setSeries((prev) => {
      const last = prev[prev.length - 1]
      const noise = () => (Math.random() - 0.5) * 0.12
      const next = {
        t: last.t + 2000,
        label: new Date(last.t + 2000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        jsonRps: Math.round(4200 * (1 + noise())),
        grpcRps: Math.round(8100 * (1 + noise())),
        jsonLatency: parseFloat((31.4 * (1 + noise())).toFixed(1)),
        grpcLatency: parseFloat((14.8 * (1 + noise())).toFixed(1)),
        jsonCpu: Math.round(68 * (1 + noise())),
        grpcCpu: Math.round(43 * (1 + noise())),
      }
      return [...prev.slice(-29), next]
    })
  }, [])

  useEffect(() => {
    if (!running) return
    const id = setInterval(tick, 2000)
    return () => clearInterval(id)
  }, [running, tick])

  const latest = series[series.length - 1]

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Hero */}
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
          <div className="flex items-start justify-between gap-8">
            <div className="max-w-2xl">
              <div className="mb-3">
                <span className="tag tag-cyan">Adaptive Binary API Gateway</span>
              </div>
              <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, color: 'var(--color-text)', marginBottom: '1rem' }}>
                Your services shouldn't<br />spend compute moving data.
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 520 }}>
                FluxGate intelligently routes service-to-service traffic through REST/JSON or gRPC/Protobuf based on workload characteristics.
              </p>
              <div className="flex gap-3 mt-6">
                <button className="btn-primary flex items-center gap-2" onClick={onRunBenchmark}>
                  <Play size={12} />
                  Run Live Benchmark
                </button>
                <button className="btn-ghost flex items-center gap-2">
                  View Architecture
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <svg width="200" height="160" viewBox="0 0 200 160">
                <defs>
                  <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(0,212,255,0.15)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
                <circle cx="100" cy="80" r="70" fill="url(#glowGrad)" />
                <circle cx="100" cy="80" r="50" fill="none" stroke="rgba(0,212,255,0.1)" strokeWidth="1" />
                <circle cx="100" cy="80" r="30" fill="none" stroke="rgba(0,212,255,0.2)" strokeWidth="1" />
                {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180
                  const x = 100 + 50 * Math.cos(rad)
                  const y = 80 + 50 * Math.sin(rad)
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="4" fill="var(--color-cyan)" opacity={0.8} />
                      <line x1="100" y1="80" x2={x} y2={y} stroke="rgba(0,212,255,0.25)" strokeWidth="1" strokeDasharray="4 4" />
                    </g>
                  )
                })}
                <circle cx="100" cy="80" r="12" fill="var(--color-cyan)" opacity={0.9} />
                <text x="100" y="84" textAnchor="middle" fill="#000" fontSize="8" fontWeight="700">FG</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Status strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          {statusMetrics.map((m, i) => (
            <div
              key={m.label}
              style={{
                padding: '1rem 1.25rem',
                borderRight: i < statusMetrics.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
                {m.label}
              </div>
              {m.accent ? (
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-green)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
                  {m.value}
                </div>
              ) : m.valueFn ? (
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                  <AnimatedNumber value={m.valueFn(series)} decimals={m.decimals || 0} suffix={m.suffix || ''} />
                </div>
              ) : (
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
                  {m.value}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comparison */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.015em', color: 'var(--color-text)' }}>
                Protocol Performance Comparison
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>
                Illustrative benchmark — run test to replace with measured data.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--color-amber)' }} />
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>REST + JSON</span>
              </div>
              <div className="flex items-center gap-2">
                <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--color-cyan)' }} />
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>gRPC + PROTOBUF</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--color-border)', borderRadius: 6, overflow: 'hidden' }}>
            {comparisons.map((c) => (
              <div key={c.label} style={{ background: 'var(--color-card)', padding: '1.5rem' }}>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>
                  {c.label}
                </div>
                <div className="flex items-end gap-3 mb-4">
                  <div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>JSON</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-amber)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>
                      {c.json}
                    </div>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--color-text-dim)', marginBottom: 6 }} />
                  <div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>gRPC</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>
                      {c.grpc}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {c.down ? (
                    <TrendingDown size={13} style={{ color: 'var(--color-green)' }} />
                  ) : (
                    <TrendingUp size={13} style={{ color: 'var(--color-cyan)' }} />
                  )}
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: c.down ? 'var(--color-green)' : 'var(--color-cyan)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {c.diff}
                  </span>
                </div>
                {/* Bar comparison */}
                <div className="mt-3 space-y-1.5">
                  <div style={{ height: 4, borderRadius: 2, background: 'rgba(245,158,11,0.35)', width: '100%' }} />
                  <div style={{
                    height: 4,
                    borderRadius: 2,
                    background: 'var(--color-cyan)',
                    width: c.label === 'THROUGHPUT' ? '100%' : '55%',
                    opacity: 0.8,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live traffic chart */}
        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6 }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>Live Traffic</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-green)' }} className="animate-pulse-dot" />
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>
                  Receiving simulated traffic
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Toggle */}
              <div style={{ display: 'flex', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
                {(['json', 'grpc', 'both'] as TrafficToggle[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setToggle(t)}
                    style={{
                      padding: '4px 12px',
                      fontSize: '0.6875rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 500,
                      background: toggle === t ? 'var(--color-card-alt)' : 'transparent',
                      color: toggle === t ? 'var(--color-text)' : 'var(--color-text-dim)',
                      border: 'none',
                      cursor: 'pointer',
                      letterSpacing: '0.05em',
                      transition: 'all 0.15s',
                    }}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setRunning(true)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: running ? 'var(--color-cyan)' : 'var(--color-text-dim)', padding: 4 }}
                >
                  <Play size={13} />
                </button>
                <button
                  onClick={() => setRunning(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: !running ? 'var(--color-amber)' : 'var(--color-text-dim)', padding: 4 }}
                >
                  <Pause size={13} />
                </button>
                <button
                  onClick={() => setSeries(generateTimeSeriesData(30))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-dim)', padding: 4 }}
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={series} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  interval={8}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1a2230',
                    border: '1px solid var(--color-border)',
                    borderRadius: 4,
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-text)',
                  }}
                />
                {(toggle === 'json' || toggle === 'both') && (
                  <Line type="monotone" dataKey="jsonRps" name="JSON req/s" stroke="#f59e0b" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                )}
                {(toggle === 'grpc' || toggle === 'both') && (
                  <Line type="monotone" dataKey="grpcRps" name="gRPC req/s" stroke="#00d4ff" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}
