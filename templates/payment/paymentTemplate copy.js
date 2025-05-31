module.exports = () => `
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { paymentMethodId, amount } = await request.json();

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
    });

    return Response.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error('Payment error:', err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
`;