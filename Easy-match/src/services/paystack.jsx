// src/services/paystack.js
export const PAYSTACK_PUBLIC_KEY = "pk_live_39173526ccd42bca840db69fddedca8d09c9d3fd"; // or test key
export const SERVER_VERIFY_ENDPOINT =
  "https://easy-match-backend.vercel.app/api/paystack/verify";

export function startPaystackTransaction(amountNGN, title, metadata, email) {
  return new Promise((resolve) => {
    if (!window.PaystackPop) {
      alert("Paystack not loaded");
      return resolve(null);
    }

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: amountNGN * 100,
      currency: "NGN",
      ref: "EM_" + Math.floor(Math.random() * 1e9),
      metadata: {
        custom_fields: [
          {
            display_name: title,
            variable_name: "meta",
            value: JSON.stringify(metadata),
          },
        ],
      },
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
