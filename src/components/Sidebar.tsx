import {
  LayoutDashboard,
  Zap,
  GitCompare,
  FlaskConical,
  Network,
  LineChart,
  Boxes,
  Settings,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'gateway', label: 'Live Gateway', icon: Zap },
  { id: 'comparison', label: 'Protocol Comparison', icon: GitCompare },
  { id: 'loadtest', label: 'Load Test', icon: FlaskConical },
  { id: 'microservices', label: 'Microservices', icon: Network },
  { id: 'observability', label: 'Observability', icon: LineChart },
  { id: 'architecture', label: 'Architecture', icon: Boxes },
  { id: 'settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  active: string
  onChange: (id: string) => void
}

export default function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside
      style={{ background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}
      className="flex flex-col w-56 shrink-0 h-full"
    >
      {/* Logo */}
      <div style={{ borderBottom: '1px solid var(--color-border)' }} className="px-5 py-4 flex items-center gap-2.5">
        <div className="relative w-7 h-7 flex items-center justify-center">
          <div
            style={{
              background: 'var(--color-cyan)',
              width: 20,
              height: 20,
              clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              background: 'var(--color-surface)',
              width: 10,
              height: 10,
              clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
            }}
          />
        </div>
        <div>
          <div style={{ color: 'var(--color-text)', fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.01em' }}>
            FluxGate
          </div>
          <div style={{ color: 'var(--color-text-dim)', fontSize: '0.625rem', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)', marginTop: 1 }}>
            v2.4.1-beta
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150 group"
              style={{
                background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--color-cyan)' : '2px solid transparent',
                color: isActive ? 'var(--color-cyan)' : 'var(--color-text-muted)',
              }}
            >
              <Icon size={15} strokeWidth={isActive ? 2 : 1.5} />
              <span style={{ fontSize: '0.8125rem', fontWeight: isActive ? 600 : 400, letterSpacing: '0.01em' }}>
                {label}
              </span>
              {isActive && <ChevronRight size={12} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--color-border)' }} className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={13} style={{ color: 'var(--color-green)' }} />
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', letterSpacing: '0.02em' }}>
            All systems operational
          </span>
        </div>
        <div
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            Local / Demo
          </span>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--color-green)',
            }}
            className="animate-pulse-dot"
          />
        </div>
      </div>
    </aside>
  )
}
