import { useState } from 'react'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import BenchmarkModal from './components/BenchmarkModal'
import Overview from './pages/Overview'
import LiveGateway from './pages/LiveGateway'
import ProtocolComparison from './pages/ProtocolComparison'
import LoadTest from './pages/LoadTest'
import Microservices from './pages/Microservices'
import Observability from './pages/Observability'
import Architecture from './pages/Architecture'
import Settings from './pages/Settings'

type Page = 'overview' | 'gateway' | 'comparison' | 'loadtest' | 'microservices' | 'observability' | 'architecture' | 'settings'

export default function App() {
  const [page, setPage] = useState<Page>('overview')
  const [showBenchmark, setShowBenchmark] = useState(false)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--color-bg)' }}>
      <Sidebar active={page} onChange={(id) => setPage(id as Page)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopNav page={page} onRunBenchmark={() => setShowBenchmark(true)} />

        <main style={{ flex: 1, overflow: 'hidden' }}>
          {page === 'overview' && <Overview onRunBenchmark={() => setShowBenchmark(true)} />}
          {page === 'gateway' && <LiveGateway />}
          {page === 'comparison' && <ProtocolComparison />}
          {page === 'loadtest' && <LoadTest />}
          {page === 'microservices' && <Microservices />}
          {page === 'observability' && <Observability />}
          {page === 'architecture' && <Architecture />}
          {page === 'settings' && <Settings />}
        </main>
      </div>

      {showBenchmark && <BenchmarkModal onClose={() => setShowBenchmark(false)} />}
    </div>
  )
}
