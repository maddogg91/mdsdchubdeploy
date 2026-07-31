const Stripe = require('stripe')(process.env['STRIPEAPI']);


async function payment(amount, url, res, id) {
const session = await Stripe.checkout.sessions.create({
  line_items: [
    {
      // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
      price_data: {
      product_data:{name: 'Project'},
      unit_amount_decimal: amount,
      currency: 'USD'
    },
      quantity: 1
    }
  ],
  allow_promotion_codes: true,
  mode: 'payment',
  metadata: { requestId: id },
  success_url: `${url}/success?id=${id}&session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${url}/cancel?id=${id}`,
  automatic_tax: {enabled: true},
});
  return session.url;
  };

async function verifyPayment(sessionId, id){
  const session= await Stripe.checkout.sessions.retrieve(sessionId);
  return session.payment_status === 'paid' && session.metadata && session.metadata.requestId === id;
}

module.exports= {payment, verifyPayment};