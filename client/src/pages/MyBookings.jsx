/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import timeFormat from '../lib/timeFormat';
import { dateFormat } from '../lib/dateFormat';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const MyBookings = () => {

    const { axios, getToken, user, image_base_url } = useAppContext();

    const currency = import.meta.env.VIT_CURRENCY || '₹';
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getMyBookings = async () => {
        try {
            const { data } = await axios.get('/api/user/bookings', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                setBookings(data.bookings)
            }
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)
    };

    useEffect(() => {
        if (user) {
            getMyBookings();
        }
    }, [user]);

    return !isLoading ? (
        <div className="min-h-screen bg-gradient-to-b from-[#0d0d0d] via-[#0f0c0c] to-[#0d0d0d] pt-24 px-4 md:px-16 pb-10">
            <h1 className="text-3xl font-bold text-white mb-10">My Bookings</h1>

            <div className="space-y-6">
                {bookings.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between bg-gradient-to-br from-[#1a0b0b] to-[#130c0c] border border-[#2e1b1b] rounded-xl p-4 md:p-6 shadow-md"
                    >

                        <div className="flex items-center gap-4">
                            <img
                                src={image_base_url + item.show.movie.poster_path}
                                alt={item.show.movie.title}
                                className="w-24 h-32 object-cover rounded-lg"
                            />

                            <div>
                                <h2 className="text-xl font-semibold text-white">{item.show.movie.title}</h2>
                                <p className="text-sm text-gray-400 mt-1">{timeFormat(item.show.movie.runtime)}</p>
                                <p className="text-sm text-gray-400 mt-1">{dateFormat(item.show.showDateTime)}</p>
                            </div>
                        </div>

                        <div className="text-right space-y-2">
                            <p className="text-xl font-bold text-white">{currency}{item.amount}</p>
                            <p className="text-sm text-gray-300">
                                <span className="font-medium text-white">Total Tickets: </span>{item.bookedSeats.length}
                            </p>
                            <p className="text-sm text-gray-300">
                                <span className="font-medium text-white">Seat Number: </span>{item.bookedSeats.join(', ')}
                            </p>
                            {!item.isPaid && (
                                <Link to={item.paymentLink} className="mt-2 text-sm bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-1 rounded-full transition cursor-pointer">
                                    Pay Now
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ) : (
        <Loading />
    );
};

export default MyBookings;
