// ============ Electricity ============

export interface BillComponent {
  id: string;
  name: string;
  rate: number; // лв/kWh без ДДС
  explanationKey: string;
}

export interface ElectricityProvider {
  id: string;
  name: string;
  region: string;
  coverageAreas: string[];
  dayRate: number; // лв/kWh с ДДС
  nightRate: number;
  singleRate: number;
  breakdown: BillComponent[];
  url: string;
}

export interface ElectricityResult {
  provider: ElectricityProvider;
  totalWithVat: number;
  breakdown: { component: BillComponent; amount: number }[];
  differenceFromCheapest: number;
  isCheapest: boolean;
}

export type MeterType = "single" | "dual";

export interface ElectricityInput {
  meterType: MeterType;
  dayKwh: number;
  nightKwh: number;
}

// ============ Water ============

export interface WaterProvider {
  id: string;
  name: string;
  city: string;
  supplyRate: number; // лв/m³ без ДДС
  sewerageRate: number;
  treatmentRate: number;
  totalRateWithVat: number;
  url?: string;
}

export interface WaterResult {
  provider: WaterProvider;
  supplyAmount: number;
  sewerageAmount: number;
  treatmentAmount: number;
  subtotal: number;
  vat: number;
  totalWithVat: number;
  differenceFromCheapest: number;
  isCheapest: boolean;
}

export interface WaterInput {
  consumptionM3: number;
}

// ============ Telecom ============

export interface TelecomPlan {
  id: string;
  operator: string;
  operatorName: string;
  planName: string;
  type: "prepaid" | "postpaid";
  monthlyFee: number;
  dataGb: number;
  minutes: number | "unlimited";
  sms: number | "unlimited";
  contractMonths: number | null;
  extras: string[];
}

export interface InternetPlan {
  id: string;
  provider: string;
  providerName: string;
  planName: string;
  speedMbps: number;
  monthlyFee: number;
  technology: string;
}

// ============ Gas ============

export interface GasProvider {
  id: string;
  name: string;
  region: string;
  coverageCities: string[];
  pricePerM3: number; // лв/m³ без ДДС
  distributionFee: number; // лв/m³ без ДДС
  transmissionFee: number;
  excise: number;
  url?: string;
}

export interface GasResult {
  provider: GasProvider;
  gasAmount: number;
  distributionAmount: number;
  transmissionAmount: number;
  exciseAmount: number;
  subtotal: number;
  vat: number;
  totalWithVat: number;
  differenceFromCheapest: number;
  isCheapest: boolean;
}

export interface GasInput {
  consumptionM3: number;
}

// ============ Loans ============

export interface LoanProduct {
  id: string;
  bank: string;
  bankName: string;
  productName: string;
  type: "consumer" | "mortgage";
  interestRate: number; // годишен лихвен %
  apr: number; // ГПР %
  minAmount: number;
  maxAmount: number;
  minTermMonths: number;
  maxTermMonths: number;
  url?: string;
}

export interface LoanResult {
  product: LoanProduct;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  differenceFromCheapest: number;
  isCheapest: boolean;
}

export interface LoanInput {
  amount: number;
  termMonths: number;
  type: "consumer" | "mortgage";
}

// ============ Insurance ============

export interface InsuranceProduct {
  id: string;
  insurer: string;
  insurerName: string;
  productName: string;
  type: "kasko" | "go" | "health" | "property";
  monthlyPremium: number;
  annualPremium: number;
  coverage: string[];
  url?: string;
}

// ============ Explanations ============

export interface Explanation {
  term: string;
  simple: string;
  icon: string;
}
