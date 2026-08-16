export default function Settings() {
  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>Settings</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', marginTop: 4 }}>Gateway configuration and preferences.</p>
        </div>

        {[
          {
            title: 'Gateway',
            fields: [
              { label: 'Gateway endpoint', value: 'localhost:8080', type: 'text' },
              { label: 'Default protocol', value: 'Auto-detect', type: 'select', options: ['Auto-detect', 'gRPC', 'REST'] },
              { label: 'Request timeout (ms)', value: '5000', type: 'number' },
            ],
          },
          {
            title: 'Benchmarks',
            fields: [
              { label: 'Default payload size', value: 'Medium', type: 'select', options: ['Small', 'Medium', 'Large'] },
              { label: 'Default concurrency', value: '50', type: 'number' },
              { label: 'Benchmark duration (sec)', value: '30', type: 'number' },
            ],
          },
        ].map(({ title, fields }) => (
          <div key={title} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 6, overflow: 'hidden' }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>{title}</h3>
            </div>
            <div className="p-5 space-y-4">
              {fields.map(({ label, value, type, options }) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{label}</div>
                  {type === 'select' ? (
                    <select defaultValue={value} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 4, color: 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', padding: '7px 10px', outline: 'none', cursor: 'pointer' }}>
                      {options?.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={type} defaultValue={value} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 4, color: 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', padding: '7px 10px', outline: 'none', width: '100%' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-primary">Save changes</button>
          <button className="btn-ghost">Reset to defaults</button>
        </div>
      </div>
    </div>
  )
}
