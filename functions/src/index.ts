import * as express from "express";
import * as functions from "firebase-functions";
import cors from "./config/cors";
import stripe from "./config/stripe";

const app = express();

app.use(cors);

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

app.get("/createCustomerPortalSession/:customerID", async (req, res) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: req.params.customerID,
  });

  functions.logger.info(session);

  res.send(session);
});

exports.api = functions.region("europe-west3").https.onRequest(app);
