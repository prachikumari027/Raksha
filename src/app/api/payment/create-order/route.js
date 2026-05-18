import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount } = body;

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpay.orders.create(options);

    return Response.json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    return new Response(JSON.stringify({ error: "Order creation failed" }), {
      status: 500,
    });
  }
}
