import type { PropertyDataPort } from "@/application/ports/property-data-port";
import type { PropertySnapshot } from "@/domain/deal/types";
import { MockPropertyAdapter } from "@/infrastructure/property-data/mock-property-adapter";

export class RentCastPropertyAdapter implements PropertyDataPort {
  constructor(
    private readonly apiKey: string,
    private readonly fallback = new MockPropertyAdapter(),
  ) {}

  async enrich(address: string): Promise<PropertySnapshot> {
    try {
      const url = new URL("https://api.rentcast.io/v1/properties");
      url.searchParams.set("address", address);
      const response = await fetch(url, {
        headers: { "X-Api-Key": this.apiKey, accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) return this.fallback.enrich(address);
      const data = (await response.json()) as Array<Record<string, unknown>>;
      const first = data[0];
      if (!first) return this.fallback.enrich(address);

      const fallback = await this.fallback.enrich(address);
      return {
        ...fallback,
        addressLine: String(first.addressLine1 ?? fallback.addressLine),
        city: String(first.city ?? fallback.city),
        state: String(first.state ?? fallback.state),
        zip: String(first.zipCode ?? fallback.zip),
        beds: Number(first.bedrooms ?? fallback.beds),
        baths: Number(first.bathrooms ?? fallback.baths),
        sqFt: Number(first.squareFootage ?? fallback.sqFt),
        yearBuilt: Number(first.yearBuilt ?? fallback.yearBuilt),
        estimatedValue: Number(
          first.estimatedValue ?? first.lastSalePrice ?? fallback.estimatedValue,
        ),
        taxAnnual: Number(first.propertyTaxes ?? fallback.taxAnnual),
        dataSource: "RentCast",
        asOf: new Date().toISOString().slice(0, 10),
      };
    } catch {
      return this.fallback.enrich(address);
    }
  }
}

export function createPropertyDataAdapter(): PropertyDataPort {
  const key = process.env.RENTCAST_API_KEY;
  if (key) return new RentCastPropertyAdapter(key);
  return new MockPropertyAdapter();
}
