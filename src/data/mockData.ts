export const services = [
  { id: 'gateway', label: 'API Gateway', x: 400, y: 60 },
  { id: 'order', label: 'Order Service', x: 220, y: 200 },
  { id: 'payment', label: 'Payment Service', x: 580, y: 200 },
  { id: 'inventory', label: 'Inventory Service', x: 100, y: 340 },
  { id: 'user', label: 'User Service', x: 340, y: 340 },
  { id: 'notification', label: 'Notification Service', x: 580, y: 340 },
]

export const connections = [
  {
    from: 'gateway',
    to: 'order',
    protocol: 'gRPC',
    rps: 4210,
    latency: 9.2,
  },
  {
    from: 'gateway',
    to: 'payment',
    protocol: 'gRPC',
    rps: 2940,
    latency: 8.8,
  },
  {
    from: 'order',
    to: 'payment',
    protocol: 'gRPC',
    rps: 2410,
    latency: 8.2,
  },
  {
    from: 'order',
    to: 'inventory',
    protocol: 'REST',
    rps: 3100,
    latency: 18.4,
  },
  {
    from: 'order',
    to: 'notification',
    protocol: 'REST',
    rps: 1102,
    latency: 21.4,
  },
  {
    from: 'gateway',
    to: 'user',
    protocol: 'gRPC',
    rps: 5820,
    latency: 7.1,
  },
]

export function generateTimeSeriesData(points = 30) {
  const now = Date.now()
  return Array.from({ length: points }, (_, i) => {
    const t = now - (points - 1 - i) * 2000
    const noise = () => (Math.random() - 0.5) * 0.15
    return {
      t,
      label: new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      jsonRps: Math.round(4200 * (1 + noise())),
      grpcRps: Math.round(8100 * (1 + noise())),
      jsonLatency: parseFloat((31.4 * (1 + noise())).toFixed(1)),
      grpcLatency: parseFloat((14.8 * (1 + noise())).toFixed(1)),
      jsonCpu: Math.round(68 * (1 + noise())),
      grpcCpu: Math.round(43 * (1 + noise())),
    }
  })
}

export const benchmarkResults = {
  small: {
    json: { payload: 1.2, latency: 12.4, throughput: 9200, cpu: 31, memory: 284 },
    grpc: { payload: 0.4, latency: 6.8, throughput: 18400, cpu: 19, memory: 198 },
  },
  medium: {
    json: { payload: 4.8, latency: 31.4, throughput: 4200, cpu: 68, memory: 482 },
    grpc: { payload: 1.9, latency: 14.8, throughput: 8100, cpu: 43, memory: 312 },
  },
  large: {
    json: { payload: 18.4, latency: 78.2, throughput: 1800, cpu: 89, memory: 812 },
    grpc: { payload: 6.1, latency: 28.6, throughput: 4900, cpu: 54, memory: 498 },
  },
}

export const observabilityData = {
  latencyHistory: Array.from({ length: 60 }, (_, i) => ({
    t: i,
    p50: 8 + Math.random() * 4,
    p95: 14 + Math.random() * 6,
    p99: 22 + Math.random() * 8,
  })),
  throughputHistory: Array.from({ length: 60 }, (_, i) => ({
    t: i,
    grpc: 7800 + Math.random() * 800,
    rest: 4000 + Math.random() * 500,
  })),
  errorHistory: Array.from({ length: 60 }, (_, i) => ({
    t: i,
    rate: 0.01 + Math.random() * 0.02,
  })),
}
