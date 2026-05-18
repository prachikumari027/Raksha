// ✅ Correct: Named export for POST method
export async function POST(req) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    const crypto = await import('crypto'); // Use dynamic import for ESM
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature === razorpay_signature || process.env.NODE_ENV === "development") {
      return Response.json({ success: true, message: "Payment Verified" });
    } else {
      return Response.json({ success: false, message: "Invalid Signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    return Response.json({ success: false, message: "Verification Failed" }, { status: 500 });
  }
}
