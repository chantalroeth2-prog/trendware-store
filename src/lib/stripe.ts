import Stripe from "stripe";

/*
 * =============================================================
 * STRIPE KONFIGURATION
 * =============================================================
 * Um Stripe zu aktivieren:
 *
 * 1. Erstelle einen Stripe-Account: https://dashboard.stripe.com/register
 * 2. Kopiere deine API-Keys aus: https://dashboard.stripe.com/test/apikeys
 * 3. Trage sie in .env.local ein (siehe .env.local.example)
 *
 * Im Testmodus kannst du folgende Kreditkarte verwenden:
 *   Nummer: 4242 4242 4242 4242
 *   Ablauf: beliebiges Datum in der Zukunft
 *   CVC:    beliebige 3 Ziffern
 * =============================================================
 */

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY fehlt. Bitte in .env.local eintragen (siehe .env.local.example)."
      );
    }
    _stripe = new Stripe(key);
  }
  return _stripe;
}
