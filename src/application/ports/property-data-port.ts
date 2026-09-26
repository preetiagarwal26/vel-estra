import type { PropertySnapshot } from "@/domain/deal/types";

export interface PropertyDataPort {
  enrich(address: string): Promise<PropertySnapshot>;
}
