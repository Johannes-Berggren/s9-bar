import _Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SK || "";
const stripe = new _Stripe(stripeSecretKey, { apiVersion: "2020-08-27" });

export default stripe;
