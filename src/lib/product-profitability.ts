export type Market = "DE" | "FR";
export type ProfitabilityStatus = "green" | "yellow" | "red" | "research";

export interface SupplierCostEstimate {
  productId: string;
  cjSku?: string;
  productCostEur?: number;
  weightGrams?: number;
  shippingEur?: Partial<Record<Market, number>>;
  status: ProfitabilityStatus;
  note?: string;
}

// Planning estimates only. Replace shipping/product costs with live CJ quote data
// before an automated product is published or repriced.
export const supplierCostEstimates: SupplierCostEstimate[] = [
  { productId: "tw-001", cjSku: "CJSN112543501AZ", productCostEur: 6.5, weightGrams: 461, shippingEur: { DE: 6, FR: 7 }, status: "green" },
  { productId: "tw-002", cjSku: "CJJT197237202BY", productCostEur: 4.3, weightGrams: 410, shippingEur: { DE: 6, FR: 7 }, status: "green" },
  { productId: "tw-003", status: "research", note: "No sufficiently exact CJ match verified yet." },
  { productId: "tw-004", status: "research", note: "No sufficiently exact CJ match verified yet." },
  { productId: "tw-005", cjSku: "CJJT142481001AZ", productCostEur: 27, weightGrams: 850, shippingEur: { DE: 8, FR: 9 }, status: "red", note: "Current supplier estimate is not economical; find cheaper supplier or reprice." },
  { productId: "tw-006", status: "research", note: "Product type found; exact CJ SKU and landed cost still need verification." },
  { productId: "tw-007", status: "research", note: "No sufficiently exact CJ match verified yet." },
  { productId: "tw-008", cjSku: "CJYD192984101AZ", productCostEur: 6.8, weightGrams: 154, shippingEur: { DE: 5, FR: 6 }, status: "green" },
];

export const PROFITABILITY_RULES = {
  greenMinMarginPct: 35,
  yellowMinMarginPct: 20,
  returnReservePct: 3,
  // Conservative planning allocation; live ad attribution should replace this.
  defaultAdCostPct: 15,
} as const;

export function estimatePaymentFee(price: number, provider: "stripe" | "paypal" = "stripe") {
  // Planning assumptions for domestic/EEA transactions.
  return provider === "paypal" ? price * 0.029 + 0.35 : price * 0.015 + 0.25;
}

export function calculateProfitability(args: {
  sellingPrice: number;
  productCost: number;
  shippingCost: number;
  paymentFee?: number;
  adCost?: number;
  returnReserve?: number;
}) {
  const paymentFee = args.paymentFee ?? estimatePaymentFee(args.sellingPrice);
  const adCost = args.adCost ?? args.sellingPrice * (PROFITABILITY_RULES.defaultAdCostPct / 100);
  const returnReserve = args.returnReserve ?? args.sellingPrice * (PROFITABILITY_RULES.returnReservePct / 100);
  const totalVariableCost = args.productCost + args.shippingCost + paymentFee + adCost + returnReserve;
  const contribution = args.sellingPrice - totalVariableCost;
  const marginPct = (contribution / args.sellingPrice) * 100;
  const status: Exclude<ProfitabilityStatus, "research"> = marginPct >= PROFITABILITY_RULES.greenMinMarginPct ? "green" : marginPct >= PROFITABILITY_RULES.yellowMinMarginPct ? "yellow" : "red";
  return { paymentFee, adCost, returnReserve, totalVariableCost, contribution, marginPct, status };
}

export function mayAutoPublish(status: ProfitabilityStatus) {
  return status === "green";
}
