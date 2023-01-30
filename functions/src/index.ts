import * as express from "express";
import * as functions from "firebase-functions";
import cors from "./config/cors";
import stripe from "./config/stripe";
import { Stripe } from "stripe";
import {
  addItem,
  getItem,
  getItems,
  getMember,
  getMembers,
  purchaseItem,
  updateItem,
  updateMember,
} from "./config/firebase";

const app = express();

app.use(cors);

app.get("/checkout-session/:memberID/:customerID/:priceID", async (req, res) => {
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
    success_url: "https://bar.futoria.no",
    cancel_url: "https://bar.futoria.no",
    metadata: {
      memberID,
    },
  });

  functions.logger.info(checkoutSession);

  res.send(checkoutSession);
});

app.get("/portal-session/:customerID", async (req, res) => {
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

app.get("/members", async (req, res) => {
  res.send(await getMembers());
});

app.put("/item", async (req, res) => {
  res.send(await updateItem(req.body));
});

app.post("/item", async (req, res) => {
  res.send(await addItem(req.body));
});

app.post("/transfer-credit-to-invoice/:memberID", async (req, res) => {
  const memberID = parseInt(req.params.memberID);
  const member = await getMember(memberID);
  const credit = member.credit;

  // Convert to øre and add 10% "late fee"
  const creditToInvoice = -Math.round(credit * 100 * 1.1);

  functions.logger.info(`Transfering balance of ${credit} to invoice item: ${creditToInvoice}`);

  await stripe.invoiceItems.create({
    customer: member.stripeID,
    amount: creditToInvoice,
    currency: "NOK",
    description: "Negativ bar-saldo",
  });

  member.credit = 0;
  const updatedMember = await updateMember(member);

  res.send(updatedMember);
});

app.post("/purchase/:itemID/:count/:memberID", async (req, res) => {
  const itemID = parseInt(req.params.itemID);
  const count = parseInt(req.params.count);
  const memberID = parseInt(req.params.memberID);
  const itemMember = await purchaseItem(itemID, count, memberID);
  res.send(itemMember);
});

app.post("/webhooks", async (req, res) => {
  functions.logger.info("/webhooks");

  const webhook = req.body as Stripe.Event;
  const session = webhook.data.object as Stripe.Checkout.Session;
  const amount = session.amount_subtotal ? session.amount_subtotal / 100 : 0;

  functions.logger.info(session.amount_subtotal);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const member = await getMember(webhook.data.object.metadata.memberID);

  member.credit += amount;

  const updatedMember = await updateMember(member);

  functions.logger.info(`${member.firstName} ${member.lastName} purchased ${amount} kr.`);
  functions.logger.info(updatedMember);

  res.send(updatedMember);
});

exports.api = functions
  .region("europe-west3")
  .runWith({ secrets: ["STRIPE_SK"] })
  .https
  .onRequest(app);
