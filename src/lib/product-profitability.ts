export type Market = "DE" | "FR";
export type ProfitabilityStatus = "green" | "yellow" | "red" | "research";

export interface ComplianceGate {
  supplierVariantVerified: boolean;
  manufacturerIdentified: boolean;
  euResponsiblePersonVerified: boolean;
  safetyInfoVerified: boolean;
  ceVerifiedIfRequired: boolean;
  weeeVerifiedIfRequired: boolean;
}

export interface SupplierCostEstimate {
  productId: string;
  cjSku?: string;
  productCostEur?: number;
  weightGrams?: number;
  shippingEur?: Partial<Record<Market, number>>;
  status: ProfitabilityStatus;
  note?: string;
}

// Planning estimates only. Live product cost, variant, stock and destination shipping must be
// refreshed from the supplier before publication or repricing.
export const supplierCostEstimates: SupplierCostEstimate[] = [
  { productId:"tw-001", cjSku:"CJSN112543501AZ", productCostEur:6.5, weightGrams:461, shippingEur:{DE:6,FR:7}, status:"green" },
  { productId:"tw-002", cjSku:"CJJT197237202BY", productCostEur:4.3, weightGrams:410, shippingEur:{DE:6,FR:7}, status:"green" },
  { productId:"tw-003", status:"research", note:"Exact supplier variant and compliance not verified." },
  { productId:"tw-004", status:"research", note:"Exact supplier variant and compliance not verified." },
  { productId:"tw-005", cjSku:"CJJT142481001AZ", productCostEur:27, weightGrams:850, shippingEur:{DE:8,FR:9}, status:"red", note:"Current supplier estimate is not economical; disabled pending replacement." },
  { productId:"tw-006", status:"research", note:"Exact supplier variant and compliance not verified." },
  { productId:"tw-007", status:"research", note:"Exact supplier variant and material claims not verified." },
  { productId:"tw-008", cjSku:"CJYD192984101AZ", productCostEur:6.8, weightGrams:154, shippingEur:{DE:5,FR:6}, status:"green" },
];

export const PROFITABILITY_RULES = { greenMinMarginPct:35, yellowMinMarginPct:20, returnReservePct:3, defaultAdCostPct:15 } as const;

export function estimatePaymentFee(price:number, provider:"stripe"|"paypal"="stripe") {
  return provider === "paypal" ? price*0.029+0.35 : price*0.015+0.25;
}

export function calculateProfitability(args:{sellingPrice:number;productCost:number;shippingCost:number;paymentFee?:number;adCost?:number;returnReserve?:number}) {
  const paymentFee=args.paymentFee ?? estimatePaymentFee(args.sellingPrice);
  const adCost=args.adCost ?? args.sellingPrice*(PROFITABILITY_RULES.defaultAdCostPct/100);
  const returnReserve=args.returnReserve ?? args.sellingPrice*(PROFITABILITY_RULES.returnReservePct/100);
  const totalVariableCost=args.productCost+args.shippingCost+paymentFee+adCost+returnReserve;
  const contribution=args.sellingPrice-totalVariableCost;
  const marginPct=(contribution/args.sellingPrice)*100;
  const status:Exclude<ProfitabilityStatus,"research">=marginPct>=35?"green":marginPct>=20?"yellow":"red";
  return {paymentFee,adCost,returnReserve,totalVariableCost,contribution,marginPct,status};
}

export function compliancePassed(gate:ComplianceGate) {
  return Object.values(gate).every(Boolean);
}

// Auto-publishing requires BOTH commercial viability and a completed product-compliance gate.
export function mayAutoPublish(status:ProfitabilityStatus, compliance?:ComplianceGate) {
  return status === "green" && !!compliance && compliancePassed(compliance);
}
