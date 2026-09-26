import type { PropertyDataPort } from "@/application/ports/property-data-port";
import type { PropertySnapshot } from "@/domain/deal/types";

function hash(value: string): number {
  let h = 0;
  for (const ch of value) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

function parseAddress(address: string) {
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  const addressLine = parts[0] ?? address;
  const city = parts[1] ?? "Austin";
  const stateZip = parts[2] ?? "TX 78704";
  const [state = "TX", zip = "78704"] = stateZip.split(/\s+/);
  return { addressLine, city, state, zip };
}

export class MockPropertyAdapter implements PropertyDataPort {
  async enrich(address: string): Promise<PropertySnapshot> {
    const parsed = parseAddress(address);
    const seed = hash(address.toLowerCase());
    const beds = 2 + (seed % 3);
    const baths = 1 + ((seed >> 3) % 3);
    const sqFt = 900 + (seed % 1600);
    const estimatedValue = 275_000 + (seed % 250_000);
    const estimatedRent = 1_800 + (seed % 1_600);

    return {
      addressLine: parsed.addressLine,
      city: parsed.city,
      state: parsed.state,
      zip: parsed.zip,
      beds,
      baths,
      sqFt,
      yearBuilt: 1975 + (seed % 45),
      estimatedValue,
      estimatedRent,
      taxAnnual: Math.round(estimatedValue * 0.012),
      dataSource: "Mock property adapter",
      asOf: new Date().toISOString().slice(0, 10),
      comps: [
        {
          address: `Nearby ${parsed.city} Comp A`,
          soldPrice: estimatedValue - 15_000,
          sqFt: sqFt - 40,
          distanceMiles: 0.3,
        },
        {
          address: `Nearby ${parsed.city} Comp B`,
          soldPrice: estimatedValue + 8_000,
          sqFt: sqFt + 80,
          distanceMiles: 0.6,
        },
        {
          address: `Nearby ${parsed.city} Comp C`,
          soldPrice: estimatedValue - 4_000,
          sqFt,
          distanceMiles: 0.9,
        },
      ],
    };
  }
}
