Build a production-quality, hackathon-winning web prototype for an
"Adaptive High-Performance Binary API Gateway".

IMPORTANT:
This is NOT a generic admin dashboard.
The product should look like a sophisticated developer infrastructure
platform used by engineers at a high-scale technology company.

The primary goal is to visually demonstrate:

1. Traditional REST + JSON communication
2. Binary gRPC + Protocol Buffers communication
3. Intelligent protocol selection
4. Live performance benchmarking
5. CPU, memory, latency, payload size and requests/sec comparison
6. The reduction of unnecessary serialization and data movement
7. High-throughput microservice communication

The prototype must be visually impressive within the first 5 seconds.

==================================================
BRAND / VISUAL IDENTITY
==================================================

Product name:
"FluxGate"

Tagline:
"Move data. Not overhead."

Alternative subtitle:
"Adaptive binary communication for high-performance microservices."

Visual style:
- Premium modern developer infrastructure platform
- Dark-first interface
- Extremely clean
- Minimal but highly polished
- High information density without feeling cluttered
- Inspired by modern observability and cloud infrastructure products
- Do NOT copy any existing product
- Strong visual hierarchy
- Sophisticated typography
- Subtle glass/metal surfaces
- Fine borders
- Soft depth
- Smooth animations
- Excellent spacing

Use a restrained dark palette:
- Near-black background
- Dark graphite cards
- White/off-white primary text
- Muted gray secondary text
- One strong electric accent for active state
- One contrasting accent for comparison/alerts

Do NOT use rainbow gradients.
Do NOT make it look like a gaming dashboard.
Do NOT overuse neon.
Do NOT use excessive rounded cards.

Typography:
- Modern sans-serif
- Strong numerical typography for metrics
- Monospace font for API paths, payloads, protocol names and technical data

==================================================
GLOBAL LAYOUT
==================================================

Create a desktop-first responsive application.

Left sidebar:
- FluxGate logo
- Overview
- Live Gateway
- Protocol Comparison
- Load Test
- Microservices
- Observability
- Architecture
- Settings

Bottom of sidebar:
- System status: "All systems operational"
- Environment selector: "Local / Demo"

Top navigation:
- Breadcrumb
- Environment
- Live status indicator
- Time range selector
- "Run Benchmark" primary CTA
- User/profile icon

The application should feel like a real product, not a static mockup.

==================================================
PAGE 1 — OVERVIEW
==================================================

Create a dramatic executive-style performance overview.

Hero section:

Title:
"Your services shouldn't spend compute moving data."

Subtitle:
"FluxGate intelligently routes service-to-service traffic through
REST/JSON or gRPC/Protobuf based on workload characteristics."

Primary button:
"Run Live Benchmark"

Secondary button:
"View Architecture"

Below the hero, create a live gateway status strip:

GATEWAY
ONLINE

REQUESTS
8,421 req/s

P95 LATENCY
14.8 ms

CPU
41%

MEMORY
482 MB

ERROR RATE
0.02%

Animate the numbers subtly.

==================================================
KEY PERFORMANCE COMPARISON
==================================================

Create a large centerpiece comparison.

Left:
REST + JSON

Right:
gRPC + PROTOBUF

Show four huge comparison metrics:

PAYLOAD
4.8 KB → 1.9 KB

P95 LATENCY
31.4 ms → 14.8 ms

THROUGHPUT
4.2K → 8.1K req/s

CPU
68% → 43%

IMPORTANT:
These are DEMO values only.
Clearly label the dashboard:
"Illustrative benchmark — run test to replace with measured data."

Use animated arrows and percentage differences.

Example:

Payload
↓ 60.4%

Latency
↓ 52.9%

Throughput
↑ 92.8%

CPU
↓ 36.8%

Do not claim these are universal improvements.
Make it clear that actual values depend on workload.

==================================================
LIVE TRAFFIC VISUALIZATION
==================================================

Create a beautiful real-time graph showing:

Requests/sec
Latency
CPU utilization

Allow toggling:
- JSON
- Protobuf
- Both

Use smooth live animation.

Add a small status:
"Receiving simulated traffic"

Controls:
[Start] [Pause] [Reset]

==================================================
PAGE 2 — LIVE GATEWAY
==================================================

This page should visually explain what the gateway is doing.

Create a horizontal animated pipeline:

CLIENT
   ↓
FLUXGATE
   ↓
PROTOCOL DECISION
   ↓
MICROSERVICES

Inside FluxGate show:

Incoming Request
↓
Payload Analysis
↓
Protocol Selection
↓
Route
↓
Response

Show a decision panel:

PROTOCOL DECISION

Payload size: 18.4 KB
Request frequency: High
Service capability: gRPC ✓

Recommendation:
gRPC + Protobuf

Reason:
"High-volume structured payload"

Confidence:
87%

This is RULE-BASED in the prototype.
Do NOT falsely claim AI.

==================================================
LIVE REQUEST INSPECTOR
==================================================

Create a terminal-style request inspector.

Example:

POST /orders/checkout

Request ID
req_8f91a2

Protocol
gRPC

Payload
18.4 KB

Serialization
Protobuf

Gateway processing
2.3 ms

Destination
payment-service

Status
200 OK

Include a toggle:

JSON VIEW
BINARY VIEW

For JSON view show readable example payload.

For binary view show a tasteful hexadecimal/binary representation.

==================================================
PAGE 3 — PROTOCOL COMPARISON
==================================================

This is one of the most important pages for the hackathon.

Title:
"Measure. Don't assume."

Create a large comparison workspace.

Controls:

Payload:
[Small] [Medium] [Large]

Traffic:
[1K] [10K] [100K] [1M]

Protocol:
[JSON] [Protobuf] [Both]

Button:
"Run Benchmark"

Show benchmark progress animation:

Preparing workload...
Sending requests...
Collecting metrics...
Analyzing results...
Complete

Then reveal results.

Create:
- Latency line chart
- Throughput chart
- CPU chart
- Memory chart
- Payload-size comparison

Every chart must have:
- Clear labels
- Units
- Legend
- Hover tooltips
- Current value
- Previous value

Add a "What changed?" summary:

"Binary transport reduced payload size by 61% in this workload."

"p95 latency decreased by 48%."

"CPU utilization decreased by 29%."

Again:
"Measured result for this workload — not a universal guarantee."

==================================================
PAGE 4 — LOAD TEST LAB
==================================================

Make this page feel like an engineering experiment console.

Title:
"Load Test Lab"

Configuration panel:

REQUESTS
[1000]

CONCURRENCY
[50]

PAYLOAD SIZE
[Medium]

DURATION
[30 sec]

TARGET SERVICE
[order-service]

PROTOCOL
[Compare Both]

Button:
"Launch Test"

During test show:

██████████████████░░ 86%

Requests completed
86,421

Successful
86,389

Failed
32

Current RPS
7,982

p95
16.2 ms

Create a real-time performance graph.

At completion show:

Benchmark complete

WINNER FOR THIS WORKLOAD

gRPC + Protobuf

Then explain why:
- Lower payload
- Lower p95 latency
- Lower CPU

==================================================
PAGE 5 — MICROSERVICE MAP
==================================================

Create an interactive architecture visualization.

Services:

API Gateway
Order Service
Payment Service
Inventory Service
User Service
Notification Service

Show animated request traffic between nodes.

Each connection should display:

Protocol
Requests/sec
Latency

Example:

Order → Payment
gRPC
2,410 req/s
8.2 ms

Order → Notification
REST
1,102 req/s
21.4 ms

Allow clicking a service to open details.

==================================================
PAGE 6 — OBSERVABILITY
==================================================

Create a professional observability page.

Metrics:

CPU
Memory
Latency
Throughput
Error rate
Payload size

Include:

- Time-series charts
- Current values
- p50
- p95
- p99
- Error rate
- Request distribution

Create filters:
Service
Protocol
Time range
Endpoint

==================================================
PAGE 7 — ARCHITECTURE
==================================================

Create an extremely polished architecture diagram.

Show:

CLIENT
   ↓
API GATEWAY
   ↓
REQUEST ANALYSIS
   ↓
PROTOCOL SELECTION
   ↙          ↘
REST/JSON    gRPC/PROTOBUF
   ↓            ↓
MICROSERVICES
   ↓
MONITORING
   ↓
BENCHMARK DASHBOARD

Clicking each component should open a small explanation panel.

Add a side panel titled:

"Why FluxGate?"

1. Minimizes repeated serialization
2. Reduces unnecessary data movement
3. Supports existing REST services
4. Enables binary communication where beneficial
5. Provides measurable performance evidence

==================================================
INTERACTION DESIGN
==================================================

The prototype must feel alive.

Add:

- Smooth page transitions
- Number animations
- Chart animations
- Hover states
- Tooltips
- Loading states
- Success states
- Error states
- Empty states
- Skeleton loaders
- Toast notifications
- Modal benchmark configuration
- Expandable metric cards

When clicking "Run Benchmark":

1. Show configuration modal
2. Start simulated benchmark
3. Animate traffic
4. Update metrics
5. Show JSON and Protobuf results
6. Highlight the better-performing option
7. Show a concise explanation
8. Allow user to inspect detailed results

==================================================
HACKATHON DEMO MODE
==================================================

Create a special "Demo Mode".

The demo should take approximately 60–90 seconds.

When activated:

Step 1:
Show traditional JSON traffic.

Step 2:
Traffic increases dramatically.

Step 3:
Show CPU and latency increasing.

Step 4:
FluxGate switches to binary communication.

Step 5:
Show the comparison.

Step 6:
Reveal the measured performance difference.

Step 7:
Show the architecture.

Step 8:
Display:

"Measure. Optimize. Scale."

This should be the strongest visual moment of the prototype.

==================================================
IMPORTANT UX PRINCIPLES
==================================================

The UI must answer these questions immediately:

1. What problem are we solving?
2. What does FluxGate do?
3. Why is it different?
4. Does it actually improve performance?
5. How do we prove it?
6. Where would it be used?

A judge should understand the entire product within 30 seconds.

Avoid:
- Generic CRUD tables
- Huge walls of text
- Excessive cards
- Fake AI terminology
- Unexplained technical jargon
- Fake benchmark claims
- Excessive animations
- Rainbow gradients
- Stock illustrations

Prioritize:
- Strong visual hierarchy
- Performance numbers
- Clear comparison
- Architecture visualization
- Real-time interaction
- Excellent typography
- Professional developer-tool aesthetics

==================================================
TECHNICAL PROTOTYPE REQUIREMENTS
==================================================

Build the frontend with:

React
TypeScript
Tailwind CSS
Recharts or another high-quality charting library
Framer Motion for animations
Lucide icons

Use reusable components.

Create realistic mock data and simulated real-time updates.

The prototype does NOT need to implement a real production gRPC
gateway yet, but the UI architecture must make it possible to connect
to real benchmark APIs later.

Use clean component architecture.

Make every major button functional in the prototype.

Do not create dead buttons.

==================================================
FINAL QUALITY BAR
==================================================

The final result should feel like:

"A startup-quality infrastructure product that could be shown
to CTOs, backend engineers, DevOps teams, and hackathon judges."

It should be visually memorable, technically credible, and extremely
easy to demo.

The central story must always remain:

PROBLEM
Repeated data conversion creates overhead.

SOLUTION
Adaptive binary communication through FluxGate.

PROOF
Live side-by-side benchmarking.

RESULT
Choose the protocol that performs best for the workload.

Final tagline:

"FluxGate — Move data. Not overhead."