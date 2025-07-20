import { Inngest } from "inngest";
import User from "../models/User.model.js";
import Booking from "../models/Booking.model.js";
import Show from "../models/Show.model.js";
import sendEmail from "../configs/nodeMailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

//Inngest Function to save user data to a data base
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }
        await User.create(userData)
    }
)

//Inngest Function to delete user from data base
const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-with-clerk' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { id } = event.data
        await User.findByIdAndDelete(id)
    }
)

//Inngest Function to update user date in data base
const syncUserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }
        await User.findByIdAndUpdate(id, userData)
    }
)

//Inngest Function to cancel booking and release seats of show after 10 minutes of booking created if payment is not done
const releaseSeatsAndDeleteBooking = inngest.createFunction(
    { id: 'release-seats-delete-booking' },
    { event: 'app/checkpayment' },
    async ({ event, step }) => {
        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait-for-10-minutes', tenMinutesLater);

        await step.run('check-payment-status', async () => {
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId);

            //If payment is not made release seats and delete booking
            if (!booking.isPaid) {
                const show = await Show.findById(booking.show)
                booking.bookedSeats.forEach((seat) => {
                    delete show.occupiedSeats[seat];
                })
                show.markModified('occupiedSeats')
                await show.save();
                await Booking.findByIdAndDelete(booking._id)
            }
        })
    }
)

//Inngest Function to send email when user books a show
const sendBookingConfirmationEmail = inngest.createFunction(
    { id: 'send-booking-confirmation-email' },
    { event: 'app/show.booked' },
    async ({ event, step }) => {
        const { bookingId } = event.data

        console.log("📨 Inngest function triggered for bookingId:", bookingId);

        const booking = await Booking.findById(bookingId).populate({
            path: 'show',
            populate: {
                path: 'movie',
                model: 'Movie'
            }
        }).populate('user')

        console.log("✅ Booking data:", {
            email: booking.user.email,
            movie: booking.show.movie.title,
            date: booking.show.showDateTime,
            seats: booking.bookedSeats
        });

        console.log("🔐 SMTP_USER:", process.env.SMTP_USER);
        console.log("🔐 SMTP_PASS starts with:", process.env.SMTP_PASS?.substring(0, 10));
        console.log("🔐 SENDER_EMAIL:", process.env.SENDER_EMAIL);

        try {
            const response = await sendEmail({
                to: booking.user.email,
                subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
                body: `<p>Test email content</p>`,
            });

            console.log("✅ Email sent! SMTP response:", response);
        } catch (error) {
            console.error("❌ Email sending failed:", error.message);
        }
    }
)

export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking,
    sendBookingConfirmationEmail
];

// const response = await sendEmail({
//             to: booking.user.email,
//             subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
//             body: `
//                 <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
//                     <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
//                         <tr>
//                         <td style="background-color: #111827; padding: 20px; text-align: center;">
//                             <h2 style="color: #ffffff; margin: 0;">TicketTerminal</h2>
//                         </td>
//                         </tr>
//                         <tr>
//                         <td style="padding: 30px;">
//                             <h3 style="margin-top: 0;">Hi ${booking.user.name},</h3>
//                             <p>Thank you for your booking! We're excited to confirm your ticket for:</p>

//                             <p style="font-size: 18px; font-weight: bold;">🎬 ${booking.show.movie.title}</p>
//                             <p>
//                                 <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('en-US', {
//                 timeZone: 'Asia/Kolkata'
//             })}<br/>
//                                 <strong>Time:</strong>${new Date(booking.show.showDateTime).toLocaleTimeString('en-US', {
//                 timeZone: 'Asia/Kolkata'
//             })}<br/>
//                                 <strong>Seats:</strong> ${booking.bookedSeats.join(', ')}<br/>
//             <p/>
                
//                             <p>Your payment has been successfully processed. Please arrive 15 minutes early to ensure a smooth experience.</p>

//                             <hr style="margin: 20px 0;" />

//                             <p>If you have any questions or need to cancel your booking, feel free to contact us.</p>

//                             <p>Enjoy the show! 🍿</p>

//                             <p>— The TicketTerminal Team</p>
//                         </td>
//                         </tr>
//                         <tr>
//                         <td style="background-color: #f3f4f6; text-align: center; padding: 15px; font-size: 12px; color: #6b7280;">
//                             © 2025 TicketTerminal. All rights reserved.
//                         </td>
//                         </tr>
//                     </table>
//                 </body>
//             `
//         })
//         console.log("📬 Email sent! Response:", response);
