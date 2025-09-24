import stripe from "../config/stripe.js";
import Tenant from "../models/Tenant.model.js";

// 1️⃣ Create a Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const { slug } = req.params;

    const tenant = await Tenant.findOne({ name: slug });
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    // Only Admin can initiate
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${tenant.name} - Pro Plan Upgrade`,
            },
            unit_amount: 1000 * 100, // $1000 in cents, change as needed
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        tenantId: tenant._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
