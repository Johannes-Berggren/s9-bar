import * as express from "express";
import * as functions from "firebase-functions";
import cors from "./config/cors";
import stripe from "./config/stripe";
import { Stripe } from "stripe";
import { getItem, getItems, getMember, updateItem, updateMember } from "./config/firebase";

const app = express();

app.use(cors);

app.get("/createCustomerCheckoutSession/:memberID/:customerID/:priceID", async (req, res) => {
  const customerID = req.params.customerID;
  const memberID = req.params.memberID;
  const priceID = req.params.priceID;

  functions.logger.info(`/createCustomerCheckoutSession/${memberID}/${customerID}/${priceID}`);

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerID,
    line_items: [{
      price: priceID,
      quantity: 1,
    }],
    mode: "payment",
    success_url: "https://s9-admin.futoria.no",
    cancel_url: "https://s9-admin.futoria.no",
    metadata: {
      memberID,
    },
  });

  functions.logger.info(checkoutSession);

  res.send(checkoutSession);
});

app.get("/createCustomerPortalSession/:customerID", async (req, res) => {
  const customerID = req.params.customerID;

  functions.logger.info(`/createCustomerPortalSession/${customerID}`);

  const session = await stripe.billingPortal.sessions.create({
    customer: customerID,
  });

  functions.logger.info(session);

  res.send(session);
});

app.get("/item/:id", async (req, res) => {
  res.send(await getItem(parseInt(req.params.id)));
});

app.get("/items", async (req, res) => {
  res.send(await getItems());
});

app.put("/item", async (req, res) => {
  res.send(await (updateItem(req.body)));
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

exports.api = functions
  .region("europe-west3")
  .runWith({ secrets: ["STRIPE_SK"] })
  .https
  .onRequest(app);
