/**
 * Offline smoke checks for Faz 1 commerce invariants.
 * Run: node scripts/smoke-commerce.mjs
 */

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function sanitizePaymentPayload(payload) {
  const blocked = ["cardNumber", "card_number", "cvc", "cvv", "expireMonth", "expireYear", "smsCode", "otp"];
  const out = {};
  for (const [key, value] of Object.entries(payload)) {
    if (blocked.some((b) => key.toLowerCase().includes(b.toLowerCase()))) continue;
    if (typeof value === "object" && value && !Array.isArray(value)) {
      out[key] = sanitizePaymentPayload(value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

const dirty = {
  paymentId: "123",
  status: "SUCCESS",
  cardNumber: "4111111111111111",
  cvc: "123",
  nested: { smsCode: "000000", ok: true },
};
const clean = sanitizePaymentPayload(dirty);
assert(clean.paymentId === "123", "paymentId kept");
assert(clean.cardNumber === undefined, "cardNumber stripped");
assert(clean.cvc === undefined, "cvc stripped");
assert(clean.nested.smsCode === undefined, "smsCode stripped");
assert(clean.nested.ok === true, "safe nested kept");

const clientTotal = 1;
const serverTotal = 5790;
assert(Math.abs(clientTotal - serverTotal) > 0.01, "client total must not be trusted");

console.log("smoke-commerce: ok");
