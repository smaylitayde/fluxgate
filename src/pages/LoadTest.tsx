import { useState, useEffect, useRef } from 'react'
import { Play, Trophy } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const services = ['order-service', 'payment-service', 'inventory-service', 'user-service', 'notification-service']

interface LivePoint { t: number; rps: number; latency: number }

export default function LoadTest() {
  const [requests, setRequests] = useState(1000)
  const [concurrency, setConcurrency] = useState(50)
  const [payloadSize, setPayloadSize] = useState('Medium')
  const [duration, setDuration] = useState(30)
  const [targetService, setTargetService] = useState('order-service')
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState(0)
  const [failed, setFailed] = useState(0)
  const [currentRps, setCurrentRps] = useState(0)
  const [p95, setP95] = useState(0)
  const [done, setDone] = useState(false)
  const [liveData, setLiveData] = useState<LivePoint[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const launchTest = () => {
    setRunning(true)
    setDone(false)
    setProgress(0)
    setCompleted(0)
    setFailed(0)
    setCurrentRps(0)
    setP95(0)
    setLiveData([])

    let p = 0
    let comp = 0
    let tick = 0

    intervalRef.current = setInterval(() => {
      tick++
      p = Math.min(100, p + 2 + Math.random() * 3)
      const newComp = Math.round((p / 100) * requests * 100)
      const delta = newComp - comp
      comp = newComp
      const rps = Math.round(7000 + Math.random() * 1800)
      const lat = parseFloat((14 + Math.random() * 5).toFixed(1))

      setProgress(Math.round(p))
      setCompleted(comp)
      setFailed(Math.round(comp * 0.00037))
      setCurrentRps(rps)
      setP95(lat)
      setLiveData((prev) => [...prev.slice(-40), { t: tick, rps, latency: lat }])

      if (p >= 100) {
        clearInterval(intervalRef.current!)
        setRunning(false)
        setDone(true)
      }
    }, 200)
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
            Load Test Lab
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', marginTop: 4 }}>
            Configure and launch a simulated load test against microservices.
          </p>
        </div>

        {/* Config panel */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { label: 'REQUESTS', value: requests, onChange: (v: number) => setRequests(v), type: 'number', min: 100, max: 1000000, step: 100 },
            { label: 'CONCURRENCY', value: concurrency, onChange: (v: number) => setConcurrency(v), type: 'number', min: 1, max: 500, step: 10 },
            { label: 'DURATION (sec)', value: duration, onChange: (v: number) => setDuration(v), type: 'number', min: 5, max: 300, step: 5 },
          ].map(({ label, value, onChange, ...rest }) => (
            <div key={label} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '1rem' }}>
              <div style={{ fontSize: '0.625rem', letterSpacing: '0.12em', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>{label}</div>
              <input
                type="number"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                min={rest.min}
                max={rest.max}
                step={rest.step}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 4,
                  color: 'var(--color-cyan)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  padding: '6px 10px',
                  width: '100%',
                  outline: 'none',
                }}
              />
            </div>
          ))}

          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '1rem' }}>
            <div style={{ fontSize: '0.625rem', letterSpacing: '0.12em', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>PAYLOAD SIZE</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['Small', 'Medium', 'Large'].map((s) => (
                <button key={s} onClick={() => setPayloadSize(s)} style={{
                  flex: 1,
                  padding: '8px 0',
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  background: payloadSize === s ? 'var(--color-cyan)' : 'var(--color-surface)',
                  color: payloadSize === s ? '#000' : 'var(--color-text-dim)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontWeight: payloadSize === s ? 700 : 400,
                  transition: 'all 0.15s',
                }}>{s}</button>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '1rem' }}>
            <div style={{ fontSize: '0.625rem', letterSpacing: '0.12em', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>TARGET SERVICE</div>
            <select
              value={targetService}
              onChange={(e) => setTargetService(e.target.value)}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 4,
                color: 'var(--color-text)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                padding: '8px 10px',
                width: '100%',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {services.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.625rem', letterSpacing: '0.12em', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>PROTOCOL</div>
            <button
              className="btn-primary flex items-center justify-center gap-2 w-full"
              onClick={launchTest}
              disabled={running}
              style={{ opacity: running ? 0.6 : 1, cursor: running ? 'not-allowed' : 'pointer', marginTop: 'auto' }}
            >
              <Play size={13} />
              Launch Test
            </button>
          </div>
        </div>

        {/* Progress */}
        {(running || done) && (
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '1.25rem' }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                Compare Both Protocols
              </span>
              <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>
                {progress}%
              </span>
            </div>
            <div style={{ height: 8, background: 'var(--color-surface)', borderRadius: 4, overflow: 'hidden', marginBottom: '1.25rem' }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--color-cyan), #00a8cc)',
                borderRadius: 4,
                transition: 'width 0.2s ease',
                boxShadow: '0 0 10px rgba(0,212,255,0.4)',
              }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
              {[
                { label: 'Requests completed', value: completed.toLocaleString() },
                { label: 'Successful', value: (completed - Math.round(completed * 0.00037)).toLocaleString(), color: 'var(--color-green)' },
                { label: 'Failed', value: Math.round(completed * 0.00037).toLocaleString(), color: 'var(--color-red)' },
                { label: 'Current RPS', value: currentRps.toLocaleString(), color: 'var(--color-cyan)' },
                { label: 'p95 Latency', value: `${p95} ms`, color: 'var(--color-cyan)' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{label.toUpperCase()}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: color || 'var(--color-text)' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live chart */}
        {liveData.length > 2 && (
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6 }}>
            <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)' }}>Real-time Performance</h4>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={liveData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="t" tick={{ fontSize: 9, fill: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={{ stroke: 'var(--color-border)' }} />
                  <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} width={40} />
                  <Tooltip contentStyle={{ background: '#1a2230', border: '1px solid var(--color-border)', borderRadius: 4, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }} />
                  <Line type="monotone" dataKey="rps" name="RPS" stroke="#00d4ff" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Result */}
        {done && (
          <div style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.25)', borderRadius: 6, padding: '1.5rem' }}>
            <div style={{ fontSize: '0.625rem', letterSpacing: '0.12em', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>BENCHMARK COMPLETE</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: 8 }}>WINNER FOR THIS WORKLOAD</div>
            <div className="flex items-center gap-3 mb-4">
              <Trophy size={24} style={{ color: 'var(--color-cyan)' }} />
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>
                gRPC + Protobuf
              </div>
            </div>
            <div className="space-y-2">
              {[
                'Lower payload — binary encoding reduced transmission overhead',
                'Lower p95 latency — less serialization work on each hop',
                'Lower CPU — protobuf parsing is more efficient than JSON tokenizing',
              ].map((s) => (
                <div key={s} style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>→ {s}</div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
