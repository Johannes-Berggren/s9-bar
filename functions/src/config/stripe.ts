import _Stripe from "stripe";

const stripe = new _Stripe(
  "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",
  { apiVersion: "2020-08-27" },
);

export default stripe;
