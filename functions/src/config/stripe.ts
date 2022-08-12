import _Stripe from "stripe";

// TODO: Put in Github secret.

const stripe = new _Stripe(
  "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",
  // "sk_test_51IZEM7I1MJoejWlLs0wD3Uyk6y0Mhe2tklDP2TpgIN98ihEsl03KjaOiIQc8vKrBBV2cWzwGqdSaf30dQFWlWbM4004jDPy3NA",
  { apiVersion: "2020-08-27" },
);

export default stripe;
