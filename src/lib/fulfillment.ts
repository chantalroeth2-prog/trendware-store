import { createOrder, type CJOrderProduct } from "./cj";
import {
  sendOwnerNotification,
  sendCustomerConfirmation,
  type OrderItem,
  type OrderEmailData,
} from "./email";
import { getAllProducts } from "@/data/product-store";
import { isProductOrderable } from "@/lib/product-compliance";

export interface FulfillmentInput {
  orderNumber: string;
  customerName: string;
  address: string;
  city: string;
  zip: string;
  countryCode: string;
  phone: string;
  email: string;
  items: { productId: string; quantity: number }[];
}

export async function fulfillOrder(input: FulfillmentInput): Promise<void> {
  // Resolve product details and split into CJ vs manual
  const cjProducts: CJOrderProduct[] = [];
  const allItems: OrderItem[] = [];
  const manualItems: OrderItem[] = [];

  const products = await getAllProducts();

  for (const item of input.items) {
    const product = products.find((p) => p.id === item.productId);
    const title = product?.title || `Produkt ${item.productId}`;
    const price = product?.price || 0;

    const orderItem: OrderItem = {
      title,
      quantity: item.quantity,
      price,
      productId: item.productId,
      cjProductId: product?.cjVariantId,
    };

    allItems.push(orderItem);

    if (product && isProductOrderable(product) && product.cjVariantId) {
      cjProducts.push({ vid: product.cjVariantId, quantity: item.quantity });
    } else {
      manualItems.push(orderItem);
    }
  }

  const total = allItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Place CJ order if there are CJ products
  let cjOrderId: string | undefined;
  if (cjProducts.length > 0) {
    try {
      const result = await createOrder({
        orderNumber: input.orderNumber,
        shippingCustomerName: input.customerName,
        shippingAddress: input.address,
        shippingCity: input.city,
        shippingZip: input.zip,
        shippingCountryCode: input.countryCode,
        shippingPhone: input.phone || "0000000000",
        products: cjProducts,
      });
      cjOrderId = result.orderId;
      console.log(`CJ-Bestellung erstellt: ${cjOrderId} für Order #${input.orderNumber}`);
    } catch (err) {
      console.error(`CJ-Bestellung fehlgeschlagen für Order #${input.orderNumber}:`, err);
      // On CJ failure, mark all CJ items as manual
      for (const item of allItems) {
        if (item.cjProductId && !manualItems.includes(item)) {
          manualItems.push(item);
        }
      }
    }
  }

  const emailData: OrderEmailData = {
    orderNumber: input.orderNumber,
    customerName: input.customerName,
    customerEmail: input.email,
    address: input.address,
    city: input.city,
    zip: input.zip,
    countryCode: input.countryCode,
    items: allItems,
    total,
    cjOrderId,
    manualItems,
  };

  // Send emails (don't let email failures break the flow)
  try {
    await sendOwnerNotification(emailData);
  } catch (err) {
    console.error("Owner-E-Mail fehlgeschlagen:", err);
  }

  try {
    await sendCustomerConfirmation(emailData);
  } catch (err) {
    console.error("Kunden-E-Mail fehlgeschlagen:", err);
  }
}
