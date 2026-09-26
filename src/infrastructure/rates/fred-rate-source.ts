import type { RateSourcePort } from "@/application/ports/rate-source-port";

const FALLBACK_RATE = 6.5;

export class FredRateSource implements RateSourcePort {
  async getBenchmarkMortgageRate(): Promise<number> {
    const apiKey = process.env.FRED_API_KEY;
    if (!apiKey) return FALLBACK_RATE;

    try {
      const url = new URL("https://api.stlouisfed.org/fred/series/observations");
      url.searchParams.set("series_id", "MORTGAGE30US");
      url.searchParams.set("api_key", apiKey);
      url.searchParams.set("file_type", "json");
      url.searchParams.set("sort_order", "desc");
      url.searchParams.set("limit", "1");
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) return FALLBACK_RATE;
      const json = (await response.json()) as {
        observations?: Array<{ value: string }>;
      };
      const value = Number(json.observations?.[0]?.value);
      return Number.isFinite(value) ? value : FALLBACK_RATE;
    } catch {
      return FALLBACK_RATE;
    }
  }
}
