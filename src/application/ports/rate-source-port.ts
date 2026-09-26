export interface RateSourcePort {
  getBenchmarkMortgageRate(): Promise<number>;
}
