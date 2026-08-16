import { useState } from 'react'
import { X, Play, CheckCircle2 } from 'lucide-react'

const steps = ['Initializing gateway...', 'Routing JSON traffic...', 'Switching to binary...', 'Collecting metrics...', 'Generating report...']

interface Props {
  onClose: () => void
}

export default function BenchmarkModal({ onClose }: Props) {
  const [running, setRunning] = useState(false)
  const [step, setStep] = useState(-1)
  const [done, setDone] = useState(false)

  const run = async () => {
    setRunning(true)
    for (let i = 0; i < steps.length; i++) {
      setStep(i)
      await new Promise((r) => setTimeout(r, 700))
    }
    setDone(true)
    setRunning(false)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        width: 520,
        overflow: 'hidden',
      }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.015em' }}>
              Run Benchmark
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
              Simulated side-by-side protocol benchmark
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-dim)', padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!running && !done && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { label: 'Payload size', value: 'Medium (4.8 KB)' },
                  { label: 'Traffic volume', value: '10,000 requests' },
                  { label: 'Concurrency', value: '50 workers' },
                  { label: 'Duration', value: '30 seconds' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 4, padding: '10px 14px' }}>
                    <div style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 3 }}>{label.toUpperCase()}</div>
                    <div style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>{value}</div>
                  </div>
                ))}
              </div>
              <button className="btn-primary flex items-center gap-2 w-full justify-center" onClick={run} style={{ marginTop: 8 }}>
                <Play size={13} />
                Start Benchmark
              </button>
            </>
          )}

          {(running || done) && (
            <div className="space-y-3">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  {done || step > i ? (
                    <CheckCircle2 size={15} style={{ color: 'var(--color-green)', flexShrink: 0 }} />
                  ) : step === i ? (
                    <div style={{ width: 15, height: 15, borderRadius: '50%', border: '2px solid var(--color-cyan)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 15, height: 15, borderRadius: '50%', border: '1px solid var(--color-border)', flexShrink: 0 }} />
                  )}
                  <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: (done || step >= i) ? 'var(--color-text)' : 'var(--color-text-dim)' }}>
                    {s}
                  </span>
                </div>
              ))}

              {done && (
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 6, padding: '1rem', marginTop: 8 }}>
                  <div style={{ fontSize: '0.6875rem', letterSpacing: '0.08em', color: 'var(--color-green)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>BENCHMARK RESULTS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {[
                      { label: 'Payload reduction', value: '↓ 60.4%' },
                      { label: 'Latency improvement', value: '↓ 52.9%' },
                      { label: 'Throughput gain', value: '↑ 92.8%' },
                      { label: 'CPU reduction', value: '↓ 36.8%' },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', marginBottom: 2 }}>{label.toUpperCase()}</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-green)', fontFamily: 'var(--font-mono)' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginTop: 10 }}>
                    Illustrative demo values — actual results depend on workload.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {done && (
          <div className="px-6 py-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <button className="btn-ghost w-full" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
