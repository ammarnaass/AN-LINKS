import * as fs from "node:fs";
import * as path from "node:path";

interface TargetRequest {
  path: string;
  method: "GET" | "POST";
  body?: string;
}

interface BenchmarkRunResult {
  concurrency: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  durationSeconds: number;
  rps: number;
  latencyMin: number;
  latencyMean: number;
  latencyP50: number;
  latencyP90: number;
  latencyP95: number;
  latencyP99: number;
  latencyMax: number;
  statusCodes: Record<string, number>;
}

const BASE_URL = process.env.TARGET_URL || "http://localhost:3000";

const TARGET_ENDPOINTS: TargetRequest[] = [
  { path: "/faisal_tech", method: "GET" },
  { path: "/omfarooq", method: "GET" },
  { path: "/sara_lifestyle", method: "GET" },
  { path: "/elfiky_legacy", method: "GET" },
  { path: "/kareem_ismail", method: "GET" },
  { path: "/api/views/faisal_tech", method: "POST" },
  { path: "/api/views/sara_lifestyle", method: "POST" },
  { path: "/api/platforms", method: "GET" },
  { path: "/api/subscriptions/plans", method: "GET" },
  { path: "/go/cmwv1fzcy004qfrkk0c4jq0kz", method: "GET" },
];

function calculatePercentile(latencies: number[], p: number): number {
  if (latencies.length === 0) return 0;
  const index = Math.ceil((p / 100) * latencies.length) - 1;
  return Number(latencies[Math.max(0, Math.min(index, latencies.length - 1))].toFixed(2));
}

async function runConcurrencyTier(
  concurrency: number,
  totalRequests: number
): Promise<BenchmarkRunResult> {
  const latencies: number[] = [];
  const statusCodes: Record<string, number> = {};
  let successfulRequests = 0;
  let failedRequests = 0;
  let requestCounter = 0;

  console.log(`\n🚀 Starting Stress Tier: Concurrency=${concurrency}, Target Requests=${totalRequests}`);
  const startTime = Date.now();

  async function worker() {
    while (true) {
      const idx = requestCounter++;
      if (idx >= totalRequests) break;

      const target = TARGET_ENDPOINTS[idx % TARGET_ENDPOINTS.length];
      const url = `${BASE_URL}${target.path}`;
      const reqStart = performance.now();

      try {
        const res = await fetch(url, {
          method: target.method,
          redirect: "manual", // Don't follow 302/307 redirects to measure redirect latency directly
          headers: {
            "User-Agent": "AN-Links-Stress-Bot/1.0",
            Accept: "text/html,application/json",
          },
        });
        const elapsed = performance.now() - reqStart;
        latencies.push(elapsed);

        const code = String(res.status);
        statusCodes[code] = (statusCodes[code] || 0) + 1;

        if (res.ok || (res.status >= 300 && res.status < 400)) {
          successfulRequests++;
        } else {
          failedRequests++;
        }
      } catch (err) {
        failedRequests++;
        statusCodes["network_err"] = (statusCodes["network_err"] || 0) + 1;
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  const durationSeconds = Number(((Date.now() - startTime) / 1000).toFixed(2));
  latencies.sort((a, b) => a - b);

  const sum = latencies.reduce((a, b) => a + b, 0);
  const latencyMean = latencies.length ? Number((sum / latencies.length).toFixed(2)) : 0;
  const latencyMin = latencies.length ? Number(latencies[0].toFixed(2)) : 0;
  const latencyMax = latencies.length ? Number(latencies[latencies.length - 1].toFixed(2)) : 0;
  const rps = durationSeconds > 0 ? Number((totalRequests / durationSeconds).toFixed(2)) : 0;

  return {
    concurrency,
    totalRequests,
    successfulRequests,
    failedRequests,
    durationSeconds,
    rps,
    latencyMin,
    latencyMean,
    latencyP50: calculatePercentile(latencies, 50),
    latencyP90: calculatePercentile(latencies, 90),
    latencyP95: calculatePercentile(latencies, 95),
    latencyP99: calculatePercentile(latencies, 99),
    latencyMax,
    statusCodes,
  };
}

async function main() {
  console.log("==========================================================");
  console.log("⚡ AN LINKS Platform Benchmark & Stress Testing Engine ⚡");
  console.log(`Target: ${BASE_URL}`);
  console.log("==========================================================");

  const tiers = [
    { concurrency: 10, totalRequests: 200 },
    { concurrency: 25, totalRequests: 500 },
    { concurrency: 50, totalRequests: 1000 },
    { concurrency: 100, totalRequests: 1500 },
  ];

  const results: BenchmarkRunResult[] = [];

  for (const tier of tiers) {
    const result = await runConcurrencyTier(tier.concurrency, tier.totalRequests);
    results.push(result);

    console.log(`  ⏱️ Duration: ${result.durationSeconds}s | Throughput: ${result.rps} req/sec`);
    console.log(`  🎯 Success: ${result.successfulRequests}/${result.totalRequests} (Errors: ${result.failedRequests})`);
    console.log(`  📊 Latency: P50=${result.latencyP50}ms | P95=${result.latencyP95}ms | P99=${result.latencyP99}ms | Max=${result.latencyMax}ms`);
    console.log(`  🏷️ Statuses: ${JSON.stringify(result.statusCodes)}`);

    // Cooldown pause between tiers to allow connection pool reset
    await new Promise((r) => setTimeout(r, 1000));
  }

  const outputPath = path.join(process.cwd(), "scripts", "benchmark-results.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf8");
  console.log(`\n✅ All benchmark tiers completed. Results saved to: ${outputPath}`);
}

main().catch((err) => {
  console.error("❌ Benchmark error:", err);
  process.exit(1);
});
