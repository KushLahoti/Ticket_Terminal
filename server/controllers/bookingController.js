import { inngest } from "../inngest/index.js";
import Booking from "../models/Booking.model.js";
import Show from "../models/Show.model.js"
import stripe from 'stripe'

//Function to check availability of selected seats for a movie
const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId);
        if (!showData) return false;
        const occupiedSeats = showData.occupiedSeats
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat])
        return !isAnySeatTaken;
    } catch (error) {
        console.log(error.message)
        return false;
    }
}

// Function with added debugging logs
export const createBooking = async (req, res) => {
    try {
        console.log("--- createBooking function started ---");
        const { userId } = req.auth();
        const { showId, selectedSeats } = req.body;
        console.log(`Step 1: Data received for showId: ${showId}`);

        const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
        if (!isAvailable) {
            console.error("Error: Seats not available.");
            return res.json({ success: false, message: "Selected Seats are not available." });
        }
        console.log("Step 2: Seat availability checked successfully.");

        const showData = await Show.findById(showId).populate('movie');
        console.log("Step 3: Show data fetched.");

        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        });
        console.log(`Step 4: Booking created in DB with ID: ${booking._id}`);

        selectedSeats.forEach((seat) => {
            showData.occupiedSeats[seat] = userId;
        });

        showData.markModified('occupiedSeats');
        await showData.save();
        console.log("Step 5: Show occupied seats updated.");

        console.log("Step 6: Attempting to send 'app/show.booked' event to Inngest...");
        await inngest.send({
            name: 'app/show.booked',
            data: {
                bookingId: booking._id
            }
        });
        console.log("Step 7: Inngest event sent successfully!");

        res.json({ success: true, message: "Booked Successfully" });

    } catch (error) {
        // This will now catch and log any error that occurs
        console.error("--- CRITICAL ERROR in createBooking catch block ---");
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getOccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;
        const showData = await Show.findById(showId);
        const occupiedSeats = Object.keys(showData.occupiedSeats);
        res.json({ success: true, occupiedSeats })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}