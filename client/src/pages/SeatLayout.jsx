import { dummyDateTimeData, dummyShowsData } from '../assets/assets';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import isoTimeFormat from '../lib/isoTimeFormat';
import toast from 'react-hot-toast';

const SeatLayout = () => {

    const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]

    const { id, date } = useParams();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [show, setShow] = useState(null);
    const navigate = useNavigate();

    const handleSeatClick = (seatId) => {
        if (!selectedTime) {
            return toast("Please Select Time First")
        }
        if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
            return toast("You can only select 5 seats")
        }
        setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
    }

    const renderSeats = (row, count = 9) => (
        <div key={row} className='flex gap-2 mt-2'>
            <div className='flex flex-wrap gap-2 items-center justify-center'>
                {Array.from({ length: count }, (_, i) => {
                    const seatId = `${row}${i + 1}`
                    return (
                        <button key={seatId} onClick={() => handleSeatClick(seatId)}
                            className={`h-8 w-8 rounded-md text-sm font-semibold border border-white/20 transition duration-200 cursor-pointer
    ${selectedSeats.includes(seatId) ? "bg-[#e50914] text-white" : "bg-white/5 text-white hover:bg-[#e50914]/80"}`}>
                            {seatId}
                        </button>
                    )
                })}
            </div>
        </div>
    )

    useEffect(() => {
        const getShow = async () => {
            const show = dummyShowsData.find(show => show._id === id);
            if (show) {
                setShow({
                    movie: show,
                    dateTime: dummyDateTimeData
                })
            }
        };
        getShow();
    }, [id])

    return show ? (
        <div className='min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-4 py-10'>
            <div className='flex items-center justify-center md:justify-start md:items-start md:flex-row gap-10 mt-10'>
                <div className='mt-20 bg-zinc-800 p-6 rounded-xl w-full md:w-[220px] shadow-lg ml-[10%]'>
                    <h2 className='font-semibold text-lg mb-5 text-white'>Available Timings</h2>
                    <div className='flex flex-col gap-3'>
                        {show.dateTime[date].map((item) => (
                            <div key={item.time} className='flex gap-2'>
                                <button
                                    onClick={() => setSelectedTime(item)}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-md transition w-35 cursor-pointer
                                        ${selectedTime?.time === item.time ? 'bg-[#e50914] text-white' : 'bg-zinc-700 hover:bg-zinc-600 text-gray-200'}`}
                                >
                                    <ClockIcon className='w-6 h-6' />
                                    <p>{isoTimeFormat(item.time)}</p>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='w-full text-center mt-8 mb-10 px-4'>
                    <h1 className='text-xl sm:text-2xl font-bold text-white mb-2'>Select Your Seat</h1>
                    <div className="flex justify-center mt-2 mb-2">
                        <svg width="80%" height="60" viewBox="0 0 500 50" fill="none" xmlns="http://www.w3.org/2000/svg" className='max-w-3xl'>
                            <path d="M10 40 Q250 0 490 40" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.15" />
                        </svg>
                    </div>
                    <p className="text-md text-center text-gray-400 font-bold">Screen Side</p>
                    <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
                        <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
                            {groupRows[0].map(row => renderSeats(row))}
                        </div>
                        <div className='grid grid-cols-2 gap-11'>
                            {groupRows.slice(1).map((group, idx) => (
                                <div key={idx}>
                                    {group.map(row => renderSeats(row))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='mt-8 flex items-center justify-center'>
                        <button onClick={() => {
                            if (selectedSeats.length === 0) {
                                return toast("Please select one seat atleast")
                            }
                            navigate('/myBookings')
                        }}
                            className='flex gap-2 text-lg bg-[#e50914] hover:bg-[#b40610] p-2 rounded-2xl cursor-pointer'>
                            Proceed to Check Out
                            <ArrowRightIcon strokeWidth={3} className='w-6 h-6 mt-0.5' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <Loading />
    )
}

export default SeatLayout