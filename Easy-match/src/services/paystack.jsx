// src/services/paystack.js
export const PAYSTACK_PUBLIC_KEY = "pk_test_xxxxx";
export const SERVER_VERIFY_ENDPOINT = "https://your-backend.com/api/verify-paystack";

export function startPaystackTransaction(amountNGN, title, metadata, email = "user@example.com") {
  return new Promise((resolve) => {
    if (!window.PaystackPop) {
      alert("Paystack not loaded");
      return resolve(null);
    }
    if (!PAYSTACK_PUBLIC_KEY || PAYSTACK_PUBLIC_KEY.includes("xxxx")) {
      alert("Paystack public key not configured");
      return resolve(null);
    }

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: amountNGN * 100,
      currency: "NGN",
      ref: "EM_" + Math.floor(Math.random() * 1e9),
      metadata: { custom_fields: [{ display_name: title, variable_name: "meta", value: JSON.stringify(metadata) }] },
      callback: (response) => {
        resolve(response.reference);
      },
      onClose: () => {
        resolve(null);
      },
    });

    handler.openIframe();
  });
}

export async function verifyPaymentOnServer(reference, expectedAmount) {
  try {
    const resp = await fetch(SERVER_VERIFY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, expectedAmount }),
    });
    const data = await resp.json();
    return data;
  } catch (err) {
    console.error("verifyPaymentOnServer error", err);
    return { verified: false };
  }
}
