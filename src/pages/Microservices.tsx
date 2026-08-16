import { useState, useEffect } from 'react'

interface ServiceNode {
  id: string
  label: string
  x: number
  y: number
}

interface Connection {
  from: string
  to: string
  protocol: 'gRPC' | 'REST'
  rps: number
  latency: number
}

const nodes: ServiceNode[] = [
  { id: 'gateway', label: 'API Gateway', x: 380, y: 60 },
  { id: 'order', label: 'Order Service', x: 180, y: 200 },
  { id: 'payment', label: 'Payment Service', x: 580, y: 200 },
  { id: 'inventory', label: 'Inventory Service', x: 60, y: 360 },
  { id: 'user', label: 'User Service', x: 310, y: 360 },
  { id: 'notification', label: 'Notification Service', x: 560, y: 360 },
]

const connections: Connection[] = [
  { from: 'gateway', to: 'order', protocol: 'gRPC', rps: 4210, latency: 9.2 },
  { from: 'gateway', to: 'payment', protocol: 'gRPC', rps: 2940, latency: 8.8 },
  { from: 'gateway', to: 'user', protocol: 'gRPC', rps: 5820, latency: 7.1 },
  { from: 'order', to: 'payment', protocol: 'gRPC', rps: 2410, latency: 8.2 },
  { from: 'order', to: 'inventory', protocol: 'REST', rps: 3100, latency: 18.4 },
  { from: 'order', to: 'notification', protocol: 'REST', rps: 1102, latency: 21.4 },
]

function getCenter(id: string) {
  const n = nodes.find((n) => n.id === id)!
  return { x: n.x + 60, y: n.y + 24 }
}

export default function Microservices() {
  const [selected, setSelected] = useState<string | null>(null)
  const [particles, setParticles] = useState<{ id: number; conn: Connection; t: number }[]>([])

  useEffect(() => {
    let counter = 0
    const id = setInterval(() => {
      const conn = connections[Math.floor(Math.random() * connections.length)]
      const particle = { id: counter++, conn, t: 0 }
      setParticles((prev) => [...prev.slice(-20), particle])
    }, 400)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, t: p.t + 0.04 }))
          .filter((p) => p.t <= 1)
      )
    }, 50)
    return () => clearInterval(id)
  }, [])

  const selectedNode = selected ? nodes.find((n) => n.id === selected) : null
  const nodeConns = selected ? connections.filter((c) => c.from === selected || c.to === selected) : []

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
            Microservice Map
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', marginTop: 4 }}>
            Click a service to inspect its connections and metrics.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem' }}>
          {/* SVG map */}
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, overflow: 'hidden' }}>
            <svg width="100%" viewBox="0 0 760 460" style={{ display: 'block' }}>
              <defs>
                <marker id="arrow-grpc" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="rgba(0,212,255,0.6)" />
                </marker>
                <marker id="arrow-rest" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="rgba(245,158,11,0.6)" />
                </marker>
              </defs>

              {/* Connection lines */}
              {connections.map((conn, i) => {
                const a = getCenter(conn.from)
                const b = getCenter(conn.to)
                const isGrpc = conn.protocol === 'gRPC'
                return (
                  <line
                    key={i}
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={isGrpc ? 'rgba(0,212,255,0.25)' : 'rgba(245,158,11,0.25)'}
                    strokeWidth={1.5}
                    markerEnd={`url(#arrow-${isGrpc ? 'grpc' : 'rest'})`}
                  />
                )
              })}

              {/* Particles */}
              {particles.map((p) => {
                const a = getCenter(p.conn.from)
                const b = getCenter(p.conn.to)
                const x = a.x + (b.x - a.x) * p.t
                const y = a.y + (b.y - a.y) * p.t
                return (
                  <circle
                    key={p.id}
                    cx={x} cy={y} r={3}
                    fill={p.conn.protocol === 'gRPC' ? 'var(--color-cyan)' : 'var(--color-amber)'}
                    opacity={1 - p.t * 0.3}
                  />
                )
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const isSelected = selected === node.id
                return (
                  <g key={node.id} onClick={() => setSelected(isSelected ? null : node.id)} style={{ cursor: 'pointer' }}>
                    <rect
                      x={node.x} y={node.y}
                      width={120} height={48}
                      rx={6}
                      fill={isSelected ? 'rgba(0,212,255,0.15)' : '#131820'}
                      stroke={isSelected ? 'rgba(0,212,255,0.7)' : '#1e2730'}
                      strokeWidth={isSelected ? 1.5 : 1}
                    />
                    {isSelected && (
                      <rect
                        x={node.x} y={node.y}
                        width={120} height={3}
                        rx={0}
                        fill="var(--color-cyan)"
                      />
                    )}
                    <text
                      x={node.x + 60} y={node.y + 20}
                      textAnchor="middle"
                      fill={isSelected ? '#00d4ff' : '#e8edf2'}
                      fontSize="11"
                      fontWeight={isSelected ? '700' : '500'}
                      fontFamily="Inter, sans-serif"
                    >
                      {node.label}
                    </text>
                    <text
                      x={node.x + 60} y={node.y + 35}
                      textAnchor="middle"
                      fill="#3d4a58"
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {node.id}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Detail panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Legend */}
            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.625rem', letterSpacing: '0.1em', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>PROTOCOL LEGEND</div>
              <div className="space-y-2">
                {[
                  { color: 'var(--color-cyan)', label: 'gRPC + Protobuf' },
                  { color: 'var(--color-amber)', label: 'REST + JSON' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div style={{ width: 20, height: 2, background: color, borderRadius: 1 }} />
                    <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedNode ? (
              <div style={{ background: 'var(--color-card)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 6, padding: '1rem' }}>
                <div style={{ fontSize: '0.625rem', letterSpacing: '0.1em', color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
                  {selectedNode.id.toUpperCase()}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 12 }}>
                  {selectedNode.label}
                </div>
                <div className="space-y-3">
                  {nodeConns.map((conn, i) => {
                    const other = conn.from === selected ? conn.to : conn.from
                    const otherNode = nodes.find((n) => n.id === other)!
                    return (
                      <div key={i} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 4, padding: '10px 12px' }}>
                        <div className="flex items-center justify-between mb-2">
                          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                            {conn.from === selected ? '→' : '←'} {otherNode.label}
                          </span>
                          <span className={`tag ${conn.protocol === 'gRPC' ? 'tag-cyan' : 'tag-amber'}`}>{conn.protocol}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <div style={{ fontSize: '0.5875rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>RPS</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>
                              {conn.rps.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.5875rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>LATENCY</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: conn.protocol === 'gRPC' ? 'var(--color-cyan)' : 'var(--color-amber)' }}>
                              {conn.latency} ms
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-dim)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)' }}>
                Click a service node to inspect connections
              </div>
            )}

            {/* All connections table */}
            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, overflow: 'hidden', marginTop: '1rem' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text)' }}>All Connections</h4>
              </div>
              {connections.map((conn, i) => (
                <div key={i} style={{ padding: '8px 16px', borderBottom: i < connections.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                  <div className="flex items-center justify-between">
                    <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                      {conn.from} → {conn.to}
                    </div>
                    <span className={`tag ${conn.protocol === 'gRPC' ? 'tag-cyan' : 'tag-amber'}`}>{conn.protocol}</span>
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                    {conn.rps.toLocaleString()} req/s · {conn.latency} ms
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
