/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import isoTimeFormat from '../lib/isoTimeFormat';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const SeatLayout = () => {

    const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    const { id, date } = useParams();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [show, setShow] = useState(null);
    const [occupiedSeats, setOccupiedSeats] = useState([])

    const { axios, getToken, user } = useAppContext();

    const getShow = async () => {
        try {
            const { data } = await axios.get(`/api/show/${id}`)
            if (data.success) {
                setShow(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSeatClick = (seatId) => {
        if (!selectedTime) {
            return toast.error("Please select a showtime first.");
        }
        if (occupiedSeats.includes(seatId)) {
            return toast.error("This seat is already booked.");
        }
        if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
            return toast.error("You can select a maximum of 5 seats.");
        }
        setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId]);
    }

    const renderSeat = (seatId) => {
        const isSelected = selectedSeats.includes(seatId);
        const isOccupied = occupiedSeats.includes(seatId);
        let seatClass = 'bg-zinc-800 border-zinc-600 hover:bg-zinc-700'; // Available
        if (isSelected) {
            seatClass = 'bg-red-600 border-red-500 text-white'; // Selected
        }
        if (isOccupied) {
            seatClass = 'bg-zinc-600 border-zinc-500 opacity-50 cursor-not-allowed'; // Occupied
        }

        return (
            <button
                key={seatId}
                onClick={() => handleSeatClick(seatId)}
                disabled={isOccupied}
                className={`flex items-center justify-center h-6 w-6 md:h-7 md:w-7 rounded-md text-xs font-semibold border transition duration-200 ${seatClass} cursor-pointer`}
            >
                <span className="text-[8px] md:text-xs">{seatId.substring(1)}</span>
            </button>
        );
    };


    const getOcuupiedSeats = async () => {
        if (!selectedTime) return;
        try {
            const { data } = await axios.get(`/api/booking/seats/${selectedTime.showId}`)
            if (data.success) {
                setOccupiedSeats(data.occupiedSeats)
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const bookTickets = async () => {
        try {
            if (!user) return toast.error("Please Login to Proceed")
            if (!selectedTime || selectedSeats.length === 0) {
                return toast.error("Please select a time and at least one seat.");
            }
            const { data } = await axios.post('/api/booking/create', { showId: selectedTime.showId, selectedSeats }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                window.location.href = data.url;
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getShow();
    }, [])

    useEffect(() => {
        getOcuupiedSeats();
    }, [selectedTime])

    // Add padding to the bottom of the main container to prevent content from being hidden by the sticky footer
    return show ? (
        <div className='min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-4 py-10 pb-32 md:pb-10'>
            <div className='flex flex-col md:flex-row items-center md:items-start justify-center gap-8 lg:gap-16'>
                {/* Timings Section */}
                <div className='w-full md:w-auto md:mt-20'>
                    <div className='bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl shadow-lg w-full'>
                        <h2 className='font-semibold text-lg mb-4 text-white text-center'>Available Timings</h2>
                        <div className='flex flex-wrap justify-center gap-3'>
                            {show.dateTime[date].map((item) => (
                                <button
                                    key={item.time}
                                    onClick={() => setSelectedTime(item)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition cursor-pointer text-sm
                                        ${selectedTime?.time === item.time ? 'bg-red-600 text-white shadow-md' : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300'}`}
                                >
                                    <ClockIcon className='w-5 h-5' />
                                    <span>{isoTimeFormat(item.time)}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Seat Layout Section */}
                <div className='w-full max-w-md text-center mt-8'>
                    <h1 className='text-xl sm:text-2xl font-bold text-white mb-4'>Select Your Seats</h1>

                    {/* Screen SVG */}
                    <div className="flex justify-center mb-1">
                        <svg width="100%" height="25" viewBox="0 0 300 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 20 Q150 0 290 20" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                        </svg>
                    </div>
                    <p className="text-sm text-center text-gray-400 mb-6">Screen This Way</p>

                    {/* Seats */}
                    <div className='flex flex-col items-center gap-2 md:gap-3'>
                        {seatRows.map(row => (
                            <div key={row} className='flex items-center gap-2 md:gap-4'>
                                <div className='font-mono text-xs md:text-sm text-zinc-400 w-4 text-right'>{row}</div>
                                <div className='flex gap-1.5 md:gap-2'>
                                    {/* Left side: 5 seats */}
                                    {Array.from({ length: 5 }, (_, i) => renderSeat(`${row}${i + 1}`))}
                                </div>
                                <div className='w-4 md:w-8' /> {/* Aisle */}
                                <div className='flex gap-1.5 md:gap-2'>
                                    {/* Right side: 5 seats */}
                                    {Array.from({ length: 5 }, (_, i) => renderSeat(`${row}${i + 6}`))}
                                </div>
                                <div className='font-mono text-xs md:text-sm text-zinc-400 w-4 text-left'>{row}</div>
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className='mt-8 flex justify-center items-center gap-x-6 gap-y-2 flex-wrap text-sm'>
                        <div className='flex items-center gap-2'><div className='h-4 w-4 rounded bg-zinc-800 border-zinc-600'></div><span>Available</span></div>
                        <div className='flex items-center gap-2'><div className='h-4 w-4 rounded bg-red-600 border-red-500'></div><span>Selected</span></div>
                        <div className='flex items-center gap-2'><div className='h-4 w-4 rounded bg-zinc-600 border-zinc-500 opacity-50'></div><span>Booked</span></div>
                    </div>
                </div>
            </div>

            {/* Booking Button - STICKY ON MOBILE */}
            <div className='mt-8'>
                {selectedSeats.length > 0 && (
                    <div className='fixed bottom-0 left-0 right-0 md:static bg-zinc-900 p-4 md:p-0 md:bg-transparent shadow-[0_-2px_10px_rgba(0,0,0,0.5)] md:shadow-none'>
                        <div className="max-w-md mx-auto">
                            <p className='text-lg font-semibold text-center mb-2'>Selected Seats: {selectedSeats.join(', ')}</p>
                            <button
                                onClick={bookTickets}
                                className='w-full flex items-center justify-center gap-2 text-lg font-bold bg-red-600 hover:bg-red-700 transition-colors py-3 px-4 rounded-lg cursor-pointer'>
                                Proceed to Checkout
                                <ArrowRightIcon strokeWidth={3} className='w-6 h-6' />
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </div>
    ) : (
        <Loading />
    )
}

export default SeatLayout