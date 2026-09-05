import type { Product } from "@/data/products";

export function hasVerifiedReviews(product: Product): boolean {
  return Boolean(
    product.reviewsVerified === true &&
      product.reviewSource &&
      product.reviewCount > 0 &&
      product.rating > 0
  );
}

export function hasCompleteGpsrInformation(product: Product): boolean {
  const gpsr = product.gpsr;
  if (!gpsr) return false;

  const manufacturerComplete = Boolean(
    gpsr.manufacturerName &&
      gpsr.manufacturerPostalAddress &&
      gpsr.manufacturerElectronicAddress &&
      gpsr.productIdentifier
  );
  const responsiblePersonComplete =
    !gpsr.euResponsiblePersonName ||
    Boolean(
      gpsr.euResponsiblePersonPostalAddress &&
        gpsr.euResponsiblePersonElectronicAddress
    );

  return manufacturerComplete && responsiblePersonComplete;
}

export function isProductOrderable(product: Product): boolean {
  return Boolean(
    product.inStock === true &&
      product.supplierAvailabilityVerified === true &&
      product.supplierAvailabilityCheckedAt &&
      product.complianceVerified === true &&
      product.cjProductId &&
      product.cjVariantId &&
      hasCompleteGpsrInformation(product)
  );
}
