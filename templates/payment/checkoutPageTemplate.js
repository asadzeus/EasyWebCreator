module.exports = () =>`
'use client';

import { Elements } from '@stripe/react-stripe-js'; 
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Complete Payment</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm amount={2200}/>
      </Elements>
    </div>
  );
}
`;