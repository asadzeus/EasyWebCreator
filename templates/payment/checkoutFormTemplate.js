module.exports = () => String.raw`
'use client';

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      '::placeholder': {
        color: '#a0aec0',
      },
    },
    invalid: {
      color: '#fa755a',
    },
  },
};

function CheckoutForm({amount}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found.');
      setLoading(false);
      return;
    }

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: amount,
        }),
      });

      const paymentIntent = await response.json();

      if (paymentIntent.error) {
        setError(paymentIntent.error);
        setLoading(false);
        return;
      }

      const { error: confirmError } = await stripe.confirmCardPayment(
        paymentIntent.clientSecret
      );

      if (confirmError) {
        setError(confirmError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      window.location.href = '/checkout/success';

    } catch (err) {
      setError(err.message || 'Unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 border rounded shadow-sm">
      <CardElement options={CARD_ELEMENT_OPTIONS} className="mb-4 p-2 border rounded" />
      
      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Processing...' : "Pay $" + amount / 100}
      </button>
    </form>
  );
}

export default CheckoutForm;
`;