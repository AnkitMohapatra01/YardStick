import express from 'express';
import stripe from '../config/stripe.js';
import Tenant from '../models/Tenant.model.js';

//?Webhook
export const router = express.Router();
// Raw body for webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log('webhook');
    
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body, // raw body required
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle event types
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const tenantId = session.metadata.tenantId;
      console.log(tenantId);

      // Upgrade tenant to Pro
      const tenant = await Tenant.findById(tenantId);
      console.log(tenant);
      
      if (tenant) {
        tenant.plan = "Pro";
        await tenant.save();
        console.log(`Tenant ${tenant.name} upgraded to Pro`);
      }
    }

    res.json({ received: true });
  }
);