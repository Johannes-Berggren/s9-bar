import * as express from "express";
import * as functions from "firebase-functions";
import cors from "./config/cors";
import stripe from "./config/stripe";
import { Stripe } from "stripe";
import { getMember, updateMember } from "./config/firebase";

const app = express();

app.use(cors);

app.get("/secrets", async (req, res) => {
  const secrets = {
    FIREBASE_TOKEN: process.env.FIREBASE_TOKEN,
    STRIPE_SK: process.env.STRIPE_SK,
  };

  functions.logger.info(secrets);

  res.send(secrets);
});

app.get("/createCustomerCheckoutSession/:memberID/:customerID", async (req, res) => {
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: req.params.customerID,
    line_items: [{
      price: "price_1LMHtpI1MJoejWlLBj1SnnjZ", // PROD
      // price: "price_1LMIWGI1MJoejWlL3PpTxkq5", // TEST
      quantity: 1,
    }],
    mode: "payment",
    success_url: "https://s9-admin.futoria.no",
    cancel_url: "https://s9-admin.futoria.no",
    metadata: {
      memberID: req.params.memberID,
    },
  });

  functions.logger.info(checkoutSession);

  res.send(checkoutSession);
});

app.get("/createCustomerPortalSession/:customerID", async (req, res) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: req.params.customerID,
  });

  functions.logger.info(process.env.STRIPE_SK);
  functions.logger.info(session);

  res.send(session);
});

app.post("/webhooks", async (req, res) => {
  const webhook = req.body as Stripe.Event;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const member = await getMember(webhook.data.object.metadata.memberID);

  member.credit += 500;

  const updatedMember = await updateMember(member);

  functions.logger.info(`${member.firstName} ${member.lastName} purchased 500 kr.`);
  functions.logger.info(updatedMember);

  res.send(updatedMember);
});

exports.api = functions.region("europe-west3").https.onRequest(app);
