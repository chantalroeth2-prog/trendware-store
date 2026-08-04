/* ------------------------------------------------------------------ */
/*  Unified Tracking Helper                                           */
/*  Fires events to GA4, Meta Pixel and TikTok Pixel simultaneously   */
/* ------------------------------------------------------------------ */

// --------------- type helpers ---------------
interface ProductData {
  id: string;
  title: string;
  price: number;
  category?: string;
  quantity?: number;
}

// --------------- GA4 (gtag) ---------------
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (...args: unknown[]) => void;
      page: () => void;
      load: (id: string) => void;
      instance: (id: string) => typeof window.ttq;
    };
  }
}

function ga(...args: unknown[]) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  }
}

function fb(...args: unknown[]) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq(...args);
  }
}

function tt(event: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.track(event, data);
  }
}

// --------------- Public API ---------------

/** Called on every page load (handled automatically by Analytics component) */
export function trackPageView() {
  // GA4 tracks automatically via gtag config
  fb("track", "PageView");
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.page();
  }
}

/** Product detail page viewed */
export function trackViewContent(product: ProductData) {
  ga("event", "view_item", {
    currency: "EUR",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        price: product.price,
        item_category: product.category,
      },
    ],
  });

  fb("track", "ViewContent", {
    content_ids: [product.id],
    content_name: product.title,
    content_type: "product",
    value: product.price,
    currency: "EUR",
  });

  tt("ViewContent", {
    content_id: product.id,
    content_name: product.title,
    content_type: "product",
    price: product.price,
    currency: "EUR",
  });
}

/** Product added to cart */
export function trackAddToCart(product: ProductData) {
  const qty = product.quantity ?? 1;

  ga("event", "add_to_cart", {
    currency: "EUR",
    value: product.price * qty,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        price: product.price,
        item_category: product.category,
        quantity: qty,
      },
    ],
  });

  fb("track", "AddToCart", {
    content_ids: [product.id],
    content_name: product.title,
    content_type: "product",
    value: product.price * qty,
    currency: "EUR",
  });

  tt("AddToCart", {
    content_id: product.id,
    content_name: product.title,
    content_type: "product",
    price: product.price,
    value: product.price * qty,
    currency: "EUR",
    quantity: qty,
  });
}

/** Checkout started */
export function trackInitiateCheckout(
  items: ProductData[],
  totalValue: number
) {
  ga("event", "begin_checkout", {
    currency: "EUR",
    value: totalValue,
    items: items.map((p) => ({
      item_id: p.id,
      item_name: p.title,
      price: p.price,
      quantity: p.quantity ?? 1,
    })),
  });

  fb("track", "InitiateCheckout", {
    content_ids: items.map((p) => p.id),
    content_type: "product",
    num_items: items.reduce((s, p) => s + (p.quantity ?? 1), 0),
    value: totalValue,
    currency: "EUR",
  });

  tt("InitiateCheckout", {
    content_ids: items.map((p) => p.id),
    content_type: "product",
    value: totalValue,
    currency: "EUR",
  });
}

/** Purchase completed */
export function trackPurchase(
  items: ProductData[],
  totalValue: number,
  orderId?: string
) {
  ga("event", "purchase", {
    transaction_id: orderId,
    currency: "EUR",
    value: totalValue,
    items: items.map((p) => ({
      item_id: p.id,
      item_name: p.title,
      price: p.price,
      quantity: p.quantity ?? 1,
    })),
  });

  fb("track", "Purchase", {
    content_ids: items.map((p) => p.id),
    content_type: "product",
    num_items: items.reduce((s, p) => s + (p.quantity ?? 1), 0),
    value: totalValue,
    currency: "EUR",
  });

  tt("CompletePayment", {
    content_ids: items.map((p) => p.id),
    content_type: "product",
    value: totalValue,
    currency: "EUR",
  });
}
