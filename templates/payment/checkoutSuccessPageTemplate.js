module.exports = () =>`
export default function SuccessPage() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-3xl font-extrabold mb-6 text-green-600">Payment Successful!</h1>
      <p className="text-lg text-gray-700">Thank you for your purchase. Your payment has been processed successfully.</p>
      <a
        href="/"
        className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Back to Home
      </a>
    </div>
  );
}
`;
