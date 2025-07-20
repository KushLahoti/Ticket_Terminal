import stripe from 'stripe'
import Booking from '../models/Booking.model.js';
import { inngest } from '../inngest/index.js';

export const stripeWebhooks = async (request, response) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
    const sig = request.headers['stripe-signature']

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`)
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object; // The session is directly available
        const { bookingId } = session.metadata;

        if (!bookingId) {
            console.error("Webhook Error: bookingId not found in session metadata.");
            // Return 200 to Stripe so it doesn't retry, but log the error.
            return response.status(200).send("Error: Missing metadata.");
        }

        try {
            // Update the booking in your database
            await Booking.findByIdAndUpdate(bookingId, {
                isPaid: true,
                paymentLink: "" // Optional: clear the payment link
            });

            // Send the event to Inngest to trigger the email
            await inngest.send({
                name: 'app/show.booked',
                data: { bookingId }
            });

            console.log("✅ Payment confirmed. Event sent to Inngest for bookingId:", bookingId);

        } catch (err) {
            console.error('Webhook processing error:', err);
            return response.status(500).send("Internal Server Error");
        }
    } else {
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Acknowledge receipt of the event
    response.json({ received: true });
};