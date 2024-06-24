// const { line_items, customer_email } = body;

// if (!line_items || !customer_email) {
//     throw new Error("Faltan datos");
// }
// let session;
// session = await stripeAPI.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items,
//     mode: "payment",
//     customer_email,
//     success_url: `${process.env.NEXTAUTH_URL}/checkout/succes/{CHECKOUT_SESSION_ID}`,
//     cancel_url: `${process.env.NEXTAUTH_URL}/checkout/canceled`,
//     shipping_address_collection: { allowed_countries: ["ES"] },
// });

// return NextResponse.json({
//     error: false,
//     message: "ok",
//     code: 200,
//     data: session.id,
// });