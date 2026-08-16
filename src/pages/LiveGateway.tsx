import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Cpu } from 'lucide-react'

const pipelineSteps = [
  'Incoming Request',
  'Payload Analysis',
  'Protocol Selection',
  'Route',
  'Response',
]

const requests = [
  { id: 'req_8f91a2', path: 'POST /orders/checkout', protocol: 'gRPC', payload: '18.4 KB', serialization: 'Protobuf', gateway: '2.3 ms', destination: 'payment-service', status: 200 },
  { id: 'req_7c4d19', path: 'GET /users/profile', protocol: 'gRPC', payload: '0.8 KB', serialization: 'Protobuf', gateway: '1.1 ms', destination: 'user-service', status: 200 },
  { id: 'req_a21f08', path: 'POST /inventory/reserve', protocol: 'REST', payload: '3.2 KB', serialization: 'JSON', gateway: '4.8 ms', destination: 'inventory-service', status: 200 },
  { id: 'req_3b9e55', path: 'PUT /notifications/send', protocol: 'REST', payload: '1.4 KB', serialization: 'JSON', gateway: '6.2 ms', destination: 'notification-service', status: 200 },
]

const jsonPayload = `{
  "orderId": "ord_92af1b",
  "userId": "usr_48291",
  "items": [
    { "sku": "SKU-001", "qty": 2, "price": 49.99 },
    { "sku": "SKU-007", "qty": 1, "price": 129.00 }
  ],
  "shipping": {
    "method": "express",
    "address": "742 Evergreen Terrace"
  },
  "total": 228.98,
  "currency": "USD",
  "timestamp": "2026-08-14T09:42:11Z"
}`

const binaryPayload = `00000000: 0a10 6f72 645f 3932 6166 3162 1210 7573  ..ord_92af1b..us
00000010: 725f 3438 3239 311a 1a08 0112 0753 4b55  r_48291......SKU
00000020: 2d30 3031 1802 2599 999a 421a 1a08 0212  -001..%...B.....
00000030: 0753 4b55 2d30 3037 1801 2500 0081 4322  .SKU-007..%...C"
00000040: 0765 7870 7265 7373 2a18 3734 3220 4576  .express*.742 Ev
00000050: 6572 6772 6565 6e20 5465 7272 6163 6535  ergreen Terrace5
00000060: 7b14 6443 3d03 5553 4448 e9ae d89f 012c  {.dC=.USDH.....,`

export default function LiveGateway() {
  const [activeStep, setActiveStep] = useState(0)
  const [selectedReq, setSelectedReq] = useState(requests[0])
  const [payloadView, setPayloadView] = useState<'json' | 'binary'>('json')
  const [confidence, setConfidence] = useState(87)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((s) => (s + 1) % pipelineSteps.length)
      setConfidence(Math.floor(82 + Math.random() * 12))
    }, 1200)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setSelectedReq(requests[Math.floor(Math.random() * requests.length)])
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
            Live Gateway
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', marginTop: 4 }}>
            Real-time protocol routing and request inspection
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
          {/* Pipeline viz */}
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6 }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)' }}>Request Pipeline</h3>
            </div>
            <div className="p-6">
              {/* Horizontal pipeline */}
              <div className="flex items-center justify-between gap-2">
                {/* CLIENT */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    background: 'var(--color-card-alt)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 6,
                    padding: '12px 16px',
                    minWidth: 80,
                  }}>
                    <Cpu size={20} style={{ color: 'var(--color-text-muted)', margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>CLIENT</div>
                  </div>
                </div>

                <ChevronRight size={16} style={{ color: 'var(--color-border)', flexShrink: 0 }} />

                {/* FluxGate pipeline */}
                <div style={{
                  background: 'rgba(0,212,255,0.05)',
                  border: '1px solid rgba(0,212,255,0.2)',
                  borderRadius: 6,
                  padding: '16px',
                  flex: 1,
                }}>
                  <div style={{ fontSize: '0.625rem', letterSpacing: '0.12em', color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)', marginBottom: 12, opacity: 0.7 }}>
                    FLUXGATE
                  </div>
                  <div className="flex items-center gap-2">
                    {pipelineSteps.map((step, i) => (
                      <div key={step} className="flex items-center gap-2">
                        <div style={{
                          padding: '6px 10px',
                          borderRadius: 4,
                          fontSize: '0.6875rem',
                          fontFamily: 'var(--font-mono)',
                          background: i === activeStep ? 'var(--color-cyan)' : 'var(--color-surface)',
                          color: i === activeStep ? '#000' : 'var(--color-text-dim)',
                          border: `1px solid ${i === activeStep ? 'var(--color-cyan)' : 'var(--color-border)'}`,
                          transition: 'all 0.3s ease',
                          whiteSpace: 'nowrap',
                          fontWeight: i === activeStep ? 600 : 400,
                          boxShadow: i === activeStep ? '0 0 12px rgba(0,212,255,0.3)' : 'none',
                        }}>
                          {step}
                        </div>
                        {i < pipelineSteps.length - 1 && (
                          <ChevronRight size={10} style={{ color: 'var(--color-border)', flexShrink: 0 }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <ChevronRight size={16} style={{ color: 'var(--color-border)', flexShrink: 0 }} />

                {/* Services */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    background: 'var(--color-card-alt)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 6,
                    padding: '12px 16px',
                    minWidth: 80,
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 6 }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{ height: 3, background: 'var(--color-border)', borderRadius: 2 }} />
                      ))}
                    </div>
                    <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>SERVICES</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decision panel */}
          <div style={{ background: 'var(--color-card)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 6 }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.625rem', letterSpacing: '0.12em', color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                PROTOCOL DECISION
              </div>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: 'Payload size', value: `${(14 + Math.random() * 8).toFixed(1)} KB` },
                { label: 'Request frequency', value: 'High' },
                { label: 'Service capability', value: 'gRPC ✓' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{label}</span>
                  <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>{value}</span>
                </div>
              ))}

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, marginTop: 4 }}>
                <div style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', marginBottom: 6 }}>
                  RECOMMENDATION
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                  gRPC + Protobuf
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                  "High-volume structured payload"
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)' }}>Confidence</span>
                  <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>{confidence}%</span>
                </div>
                <div style={{ height: 4, background: 'var(--color-surface)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${confidence}%`,
                    background: 'var(--color-cyan)',
                    borderRadius: 2,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
                <div style={{ fontSize: '0.5875rem', color: 'var(--color-text-dim)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                  Rule-based routing — not AI inference
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Request inspector */}
        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6 }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)' }}>Request Inspector</h3>
            <div style={{ display: 'flex', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
              {(['json', 'binary'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setPayloadView(v)}
                  style={{
                    padding: '4px 14px',
                    fontSize: '0.6875rem',
                    fontFamily: 'var(--font-mono)',
                    background: payloadView === v ? 'var(--color-card-alt)' : 'transparent',
                    color: payloadView === v ? 'var(--color-text)' : 'var(--color-text-dim)',
                    border: 'none',
                    cursor: 'pointer',
                    letterSpacing: '0.05em',
                  }}
                >
                  {v === 'json' ? 'JSON VIEW' : 'BINARY VIEW'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr' }}>
            {/* Request list */}
            <div style={{ borderRight: '1px solid var(--color-border)' }}>
              {requests.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedReq(r)}
                  className="w-full text-left px-4 py-3 transition-all"
                  style={{
                    background: selectedReq.id === r.id ? 'rgba(0,212,255,0.06)' : 'transparent',
                    borderLeft: selectedReq.id === r.id ? '2px solid var(--color-cyan)' : '2px solid transparent',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text)', marginBottom: 2 }}>
                    {r.path}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`tag ${r.protocol === 'gRPC' ? 'tag-cyan' : 'tag-amber'}`}>{r.protocol}</span>
                    <span style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>{r.id}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Detail + payload */}
            <div className="p-5">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                {[
                  { label: 'Request ID', value: selectedReq.id },
                  { label: 'Protocol', value: selectedReq.protocol },
                  { label: 'Payload', value: selectedReq.payload },
                  { label: 'Serialization', value: selectedReq.serialization },
                  { label: 'Gateway processing', value: selectedReq.gateway },
                  { label: 'Destination', value: selectedReq.destination },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 3 }}>
                      {label.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', color: '#4ade80', lineHeight: 1.7, background: 'var(--color-surface)', borderRadius: 4, padding: '1rem', whiteSpace: 'pre', overflowX: 'auto', fontSize: '0.6875rem' }}>
                {payloadView === 'json' ? jsonPayload : binaryPayload}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
