import { useState } from 'react'

interface Component {
  id: string
  label: string
  sub?: string
  y: number
  x?: number
  wide?: boolean
  color?: string
}

const topComponents: Component[] = [
  { id: 'client', label: 'CLIENT', sub: 'Browser / Mobile / Service', y: 0 },
  { id: 'gateway', label: 'API GATEWAY', sub: 'FluxGate Entry Point', y: 100 },
  { id: 'analysis', label: 'REQUEST ANALYSIS', sub: 'Payload size · Frequency · Schema', y: 200 },
  { id: 'selection', label: 'PROTOCOL SELECTION', sub: 'Rule-based routing decision', y: 300 },
]

const splitComponents = [
  { id: 'rest', label: 'REST / JSON', color: '#f59e0b', x: 120 },
  { id: 'grpc', label: 'gRPC / PROTOBUF', color: '#00d4ff', x: 460 },
]

const bottomComponents: Component[] = [
  { id: 'microservices', label: 'MICROSERVICES', sub: 'Order · Payment · Inventory · User', y: 0 },
  { id: 'monitoring', label: 'MONITORING', sub: 'Metrics · Tracing · Alerting', y: 100 },
  { id: 'dashboard', label: 'BENCHMARK DASHBOARD', sub: 'FluxGate Observability UI', y: 200 },
]

const explanations: Record<string, { title: string; body: string }> = {
  client: { title: 'Client', body: 'Any HTTP or gRPC-capable client: browser applications, mobile apps, CLI tools, or other microservices. Clients communicate with a single endpoint — FluxGate handles the rest.' },
  gateway: { title: 'API Gateway', body: 'FluxGate is the single ingress point for all service-to-service traffic. It inspects each request and routes it through the optimal protocol without requiring client changes.' },
  analysis: { title: 'Request Analysis', body: 'FluxGate examines payload size, request frequency, response schema, and target service capabilities before making a routing decision. No inference is required — this is rule-based.' },
  selection: { title: 'Protocol Selection', body: 'Based on analysis, the gateway selects REST/JSON (better for ad-hoc, schema-flexible traffic) or gRPC/Protobuf (better for high-frequency, structured, binary-safe payloads).' },
  rest: { title: 'REST + JSON', body: 'Existing REST services continue to work without modification. FluxGate routes appropriate traffic through HTTP/1.1 or HTTP/2 with JSON serialization.' },
  grpc: { title: 'gRPC + Protobuf', body: 'For high-throughput structured data, FluxGate routes through gRPC over HTTP/2 using Protocol Buffers. This reduces payload size, serialization overhead, and CPU load.' },
  microservices: { title: 'Microservices', body: 'Downstream services receive traffic via their native protocol. They do not need to implement both protocols — FluxGate translates where necessary.' },
  monitoring: { title: 'Monitoring', body: 'All gateway decisions, latencies, payload sizes, and error rates are emitted as structured metrics and traces, compatible with OpenTelemetry collectors.' },
  dashboard: { title: 'Benchmark Dashboard', body: 'The FluxGate UI provides real-time visibility into protocol routing decisions, performance comparisons, and load test results — this very interface.' },
}

const whyPoints = [
  'Minimizes repeated serialization across service hops',
  'Reduces unnecessary data movement between services',
  'Supports existing REST services — no rewrites needed',
  'Enables binary communication where it measurably helps',
  'Provides instrumented performance evidence per workload',
]

function NodeBox({ id, label, sub, selected, onSelect, color }: { id: string; label: string; sub?: string; selected: boolean; onSelect: (id: string) => void; color?: string }) {
  return (
    <div
      onClick={() => onSelect(id)}
      style={{
        background: selected ? (color ? `${color}18` : 'rgba(0,212,255,0.08)') : 'var(--color-card)',
        border: `1px solid ${selected ? (color || 'var(--color-cyan)') : 'var(--color-border)'}`,
        borderRadius: 6,
        padding: '12px 20px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'center',
        boxShadow: selected ? `0 0 20px ${color ? color + '22' : 'rgba(0,212,255,0.1)'}` : 'none',
      }}
    >
      <div style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.08em',
        color: selected ? (color || 'var(--color-cyan)') : 'var(--color-text)',
      }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginTop: 3 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function Arrow() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 28 }}>
      <svg width="12" height="24" viewBox="0 0 12 24">
        <line x1="6" y1="0" x2="6" y2="16" stroke="var(--color-border)" strokeWidth="1.5" />
        <path d="M2,13 L6,20 L10,13" fill="none" stroke="var(--color-border)" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

export default function Architecture() {
  const [selected, setSelected] = useState<string | null>(null)

  const explanation = selected ? explanations[selected] : null

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
            Architecture
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', marginTop: 4 }}>
            Click any component to learn how it works.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem', alignItems: 'start' }}>
          {/* Diagram */}
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '2rem' }}>
            {/* Top chain */}
            <div style={{ maxWidth: 380, margin: '0 auto' }}>
              {topComponents.map((c, i) => (
                <div key={c.id}>
                  <NodeBox id={c.id} label={c.label} sub={c.sub} selected={selected === c.id} onSelect={setSelected} />
                  {i < topComponents.length - 1 && <Arrow />}
                </div>
              ))}
            </div>

            {/* Split */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6rem', margin: '0 auto', maxWidth: 560, marginTop: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'center', height: 28, alignItems: 'center' }}>
                  <svg width="80" height="24" viewBox="0 0 80 24">
                    <line x1="40" y1="0" x2="40" y2="8" stroke="var(--color-border)" strokeWidth="1.5" />
                    <line x1="40" y1="8" x2="6" y2="20" stroke="var(--color-border)" strokeWidth="1.5" />
                    <path d="M2,16 L6,23 L10,16" fill="none" stroke="var(--color-border)" strokeWidth="1.5" />
                  </svg>
                </div>
                <NodeBox id="rest" label="REST / JSON" selected={selected === 'rest'} onSelect={setSelected} color="#f59e0b" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'center', height: 28, alignItems: 'center' }}>
                  <svg width="80" height="24" viewBox="0 0 80 24">
                    <line x1="40" y1="0" x2="40" y2="8" stroke="var(--color-border)" strokeWidth="1.5" />
                    <line x1="40" y1="8" x2="74" y2="20" stroke="var(--color-border)" strokeWidth="1.5" />
                    <path d="M70,16 L74,23 L78,16" fill="none" stroke="var(--color-border)" strokeWidth="1.5" />
                  </svg>
                </div>
                <NodeBox id="grpc" label="gRPC / PROTOBUF" selected={selected === 'grpc'} onSelect={setSelected} color="#00d4ff" />
              </div>
            </div>

            {/* Bottom chain */}
            <div style={{ maxWidth: 380, margin: '0 auto', marginTop: 0 }}>
              <Arrow />
              {bottomComponents.map((c, i) => (
                <div key={c.id}>
                  <NodeBox id={c.id} label={c.label} sub={c.sub} selected={selected === c.id} onSelect={setSelected} />
                  {i < bottomComponents.length - 1 && <Arrow />}
                </div>
              ))}
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            {/* Explanation */}
            {explanation ? (
              <div style={{ background: 'var(--color-card)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 6, padding: '1.25rem' }}>
                <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', color: 'var(--color-cyan)', marginBottom: 8 }}>
                  {explanation.title.toUpperCase()}
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  {explanation.body}
                </p>
              </div>
            ) : (
              <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '1.25rem', color: 'var(--color-text-dim)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
                Select a component to learn more
              </div>
            )}

            {/* Why FluxGate */}
            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '1.25rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 12 }}>
                Why FluxGate?
              </div>
              <div className="space-y-3">
                {whyPoints.map((p, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: 'var(--color-cyan-dim)',
                      border: '1px solid rgba(0,212,255,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 1,
                    }}>
                      <span style={{ fontSize: '0.5625rem', fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)', fontWeight: 700 }}>
                        {i + 1}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Final tagline */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(0,212,255,0.02) 100%)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: 6,
              padding: '1.25rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.015em', marginBottom: 4 }}>
                Measure. Optimize. Scale.
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>
                FluxGate — Move data. Not overhead.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
