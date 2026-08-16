import { useState } from 'react'
import { Bell, User, Clock, Play, ChevronRight } from 'lucide-react'

const pageLabels: Record<string, string> = {
  overview: 'Overview',
  gateway: 'Live Gateway',
  comparison: 'Protocol Comparison',
  loadtest: 'Load Test',
  microservices: 'Microservices',
  observability: 'Observability',
  architecture: 'Architecture',
  settings: 'Settings',
}

const timeRanges = ['1m', '5m', '15m', '1h', '6h']

interface TopNavProps {
  page: string
  onRunBenchmark: () => void
}

export default function TopNav({ page, onRunBenchmark }: TopNavProps) {
  const [range, setRange] = useState('5m')

  return (
    <header
      style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}
      className="flex items-center gap-4 px-6 h-12 shrink-0"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
        <span>FluxGate</span>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--color-text)' }}>{pageLabels[page] || page}</span>
      </div>

      <div className="flex-1" />

      {/* Time range */}
      <div className="flex items-center gap-1">
        <Clock size={12} style={{ color: 'var(--color-text-dim)' }} />
        {timeRanges.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              background: range === r ? 'var(--color-card-alt)' : 'transparent',
              color: range === r ? 'var(--color-text)' : 'var(--color-text-dim)',
              border: range === r ? '1px solid var(--color-border)' : '1px solid transparent',
              borderRadius: 3,
              fontSize: '0.6875rem',
              padding: '2px 8px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              transition: 'all 0.15s',
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-1.5">
        <div
          style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-green)' }}
          className="animate-pulse-dot"
        />
        <span style={{ fontSize: '0.6875rem', color: 'var(--color-green)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
          LIVE
        </span>
      </div>

      {/* CTA */}
      <button className="btn-primary flex items-center gap-1.5" onClick={onRunBenchmark}>
        <Play size={11} />
        Run Benchmark
      </button>

      {/* Icons */}
      <div className="flex items-center gap-3">
        <button style={{ color: 'var(--color-text-dim)', background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
          <Bell size={15} />
        </button>
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'var(--color-card-alt)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <User size={13} style={{ color: 'var(--color-text-muted)' }} />
        </div>
      </div>
    </header>
  )
}
