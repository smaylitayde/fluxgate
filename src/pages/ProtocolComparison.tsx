import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { Play, CheckCircle2 } from 'lucide-react'
import { benchmarkResults } from '../data/mockData'

type PayloadSize = 'small' | 'medium' | 'large'
type Traffic = '1K' | '10K' | '100K' | '1M'
type ProtocolMode = 'json' | 'grpc' | 'both'

const progressSteps = [
  'Preparing workload...',
  'Sending requests...',
  'Collecting metrics...',
  'Analyzing results...',
  'Complete',
]

function generateChartData(result: typeof benchmarkResults.medium) {
  return Array.from({ length: 20 }, (_, i) => ({
    t: i,
    jsonLatency: result.json.latency * (0.8 + Math.random() * 0.4),
    grpcLatency: result.grpc.latency * (0.8 + Math.random() * 0.4),
    jsonThroughput: result.json.throughput * (0.85 + Math.random() * 0.3),
    grpcThroughput: result.grpc.throughput * (0.85 + Math.random() * 0.3),
    jsonCpu: result.json.cpu * (0.9 + Math.random() * 0.2),
    grpcCpu: result.grpc.cpu * (0.9 + Math.random() * 0.2),
  }))
}

export default function ProtocolComparison() {
  const [payload, setPayload] = useState<PayloadSize>('medium')
  const [traffic, setTraffic] = useState<Traffic>('10K')
  const [protocol, setProtocol] = useState<ProtocolMode>('both')
  const [running, setRunning] = useState(false)
  const [step, setStep] = useState(-1)
  const [done, setDone] = useState(false)
  const [chartData, setChartData] = useState<ReturnType<typeof generateChartData> | null>(null)

  const result = benchmarkResults[payload]

  const runBenchmark = async () => {
    setRunning(true)
    setDone(false)
    setChartData(null)
    for (let i = 0; i < progressSteps.length; i++) {
      setStep(i)
      await new Promise((r) => setTimeout(r, i === progressSteps.length - 1 ? 400 : 800))
    }
    setChartData(generateChartData(result))
    setDone(true)
    setRunning(false)
  }

  const pctDiff = (a: number, b: number) => (((b - a) / a) * 100).toFixed(1)

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
            Measure. Don't assume.
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', marginTop: 4 }}>
            Configure and run a side-by-side protocol benchmark against simulated workloads.
          </p>
        </div>

        {/* Controls */}
        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) auto', gap: '1.25rem', alignItems: 'end' }}>
            <div>
              <div style={{ fontSize: '0.625rem', letterSpacing: '0.1em', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>PAYLOAD</div>
              <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
                {(['small', 'medium', 'large'] as PayloadSize[]).map((p) => (
                  <button key={p} onClick={() => setPayload(p)} style={{
                    flex: 1,
                    padding: '6px 0',
                    fontSize: '0.6875rem',
                    fontFamily: 'var(--font-mono)',
                    background: payload === p ? 'var(--color-cyan)' : 'transparent',
                    color: payload === p ? '#000' : 'var(--color-text-dim)',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: payload === p ? 600 : 400,
                    transition: 'all 0.15s',
                    textTransform: 'capitalize',
                  }}>{p}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.625rem', letterSpacing: '0.1em', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>TRAFFIC</div>
              <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
                {(['1K', '10K', '100K', '1M'] as Traffic[]).map((t) => (
                  <button key={t} onClick={() => setTraffic(t)} style={{
                    flex: 1,
                    padding: '6px 0',
                    fontSize: '0.6875rem',
                    fontFamily: 'var(--font-mono)',
                    background: traffic === t ? 'var(--color-cyan)' : 'transparent',
                    color: traffic === t ? '#000' : 'var(--color-text-dim)',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: traffic === t ? 600 : 400,
                    transition: 'all 0.15s',
                  }}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.625rem', letterSpacing: '0.1em', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>PROTOCOL</div>
              <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
                {(['json', 'grpc', 'both'] as ProtocolMode[]).map((p) => (
                  <button key={p} onClick={() => setProtocol(p)} style={{
                    flex: 1,
                    padding: '6px 0',
                    fontSize: '0.6875rem',
                    fontFamily: 'var(--font-mono)',
                    background: protocol === p ? 'var(--color-cyan)' : 'transparent',
                    color: protocol === p ? '#000' : 'var(--color-text-dim)',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: protocol === p ? 600 : 400,
                    transition: 'all 0.15s',
                    textTransform: 'uppercase',
                  }}>{p}</button>
                ))}
              </div>
            </div>
            <div />
            <button
              className="btn-primary flex items-center gap-2"
              onClick={runBenchmark}
              disabled={running}
              style={{ opacity: running ? 0.6 : 1, cursor: running ? 'not-allowed' : 'pointer' }}
            >
              <Play size={12} />
              Run Benchmark
            </button>
          </div>
        </div>

        {/* Progress */}
        {(running || done) && (
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '1.25rem' }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {progressSteps.map((s, i) => (
                <div key={s} className="flex items-center gap-1.5">
                  {step > i || done ? (
                    <CheckCircle2 size={13} style={{ color: 'var(--color-green)' }} />
                  ) : step === i ? (
                    <div style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid var(--color-cyan)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                  ) : (
                    <div style={{ width: 13, height: 13, borderRadius: '50%', border: '1px solid var(--color-border)' }} />
                  )}
                  <span style={{
                    fontSize: '0.6875rem',
                    fontFamily: 'var(--font-mono)',
                    color: step >= i || done ? 'var(--color-text)' : 'var(--color-text-dim)',
                  }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {chartData && done && (
          <>
            {/* Summary */}
            <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 6, padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', color: 'var(--color-green)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
                WHAT CHANGED
              </div>
              <div className="space-y-1.5">
                {[
                  `Binary transport reduced payload size by ${pctDiff(result.json.payload, result.grpc.payload).replace('-', '')}% in this workload.`,
                  `p95 latency decreased by ${pctDiff(result.json.latency, result.grpc.latency).replace('-', '')}%.`,
                  `CPU utilization decreased by ${pctDiff(result.json.cpu, result.grpc.cpu).replace('-', '')}%.`,
                ].map((s) => (
                  <div key={s} style={{ fontSize: '0.8125rem', color: 'var(--color-text)' }}>→ {s}</div>
                ))}
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginTop: 8 }}>
                  Measured result for this workload — not a universal guarantee.
                </div>
              </div>
            </div>

            {/* Charts 2x2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { title: 'P95 Latency (ms)', jsonKey: 'jsonLatency', grpcKey: 'grpcLatency', unit: 'ms' },
                { title: 'Throughput (req/s)', jsonKey: 'jsonThroughput', grpcKey: 'grpcThroughput', unit: 'req/s' },
                { title: 'CPU Utilization (%)', jsonKey: 'jsonCpu', grpcKey: 'grpcCpu', unit: '%' },
              ].map(({ title, jsonKey, grpcKey }) => (
                <div key={title} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6 }}>
                  <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)' }}>{title}</h4>
                  </div>
                  <div className="p-4">
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="t" tick={{ fontSize: 9, fill: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={{ stroke: 'var(--color-border)' }} />
                        <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} width={35} />
                        <Tooltip contentStyle={{ background: '#1a2230', border: '1px solid var(--color-border)', borderRadius: 4, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }} />
                        {(protocol === 'json' || protocol === 'both') && (
                          <Line type="monotone" dataKey={jsonKey} name="JSON" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                        )}
                        {(protocol === 'grpc' || protocol === 'both') && (
                          <Line type="monotone" dataKey={grpcKey} name="gRPC" stroke="#00d4ff" strokeWidth={1.5} dot={false} />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}

              {/* Payload bar chart */}
              <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6 }}>
                <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)' }}>Payload Size (KB)</h4>
                </div>
                <div className="p-4">
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={[{ name: 'Size', json: result.json.payload, grpc: result.grpc.payload }]} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={{ stroke: 'var(--color-border)' }} />
                      <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} width={35} />
                      <Tooltip contentStyle={{ background: '#1a2230', border: '1px solid var(--color-border)', borderRadius: 4, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }} />
                      <Bar dataKey="json" name="JSON (KB)" fill="#f59e0b" opacity={0.8} radius={[3, 3, 0, 0]} />
                      <Bar dataKey="grpc" name="gRPC (KB)" fill="#00d4ff" opacity={0.8} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {!running && !done && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
            Configure parameters above and click "Run Benchmark" to begin.
          </div>
        )}

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
