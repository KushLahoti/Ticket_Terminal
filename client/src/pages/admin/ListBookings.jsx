import Loading from '../../components/Loading';
import { dummyBookingData } from '../../assets/assets';
import React, { useEffect, useState } from 'react'
import { dateFormat } from '../../lib/dateFormat';
import Title from '../../components/admin/Title';

const ListBookings = () => {
    const currency = import.meta.env.VITE_CURRENCY;

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getAllBookings = async () => {
        setBookings(dummyBookingData)
        setIsLoading(false)
    };

    useEffect(() => {
        getAllBookings();
    }, []);

    return !isLoading ? (
        <>
            <Title text1="List" text2="Bookings" />
            <div className="max-w-4xl mt-6 overflow-x-auto bg-black/20 rounded-xl shadow-lg">
                <table className="w-full border-collapse text-sm text-gray-200">
                    <thead>
                        <tr className="bg-black/40 text-white uppercase text-xs tracking-wide">
                            <th className="px-6 py-3 text-left">User Name</th>
                            <th className="px-6 py-3 text-left">Movie Name</th>
                            <th className="px-6 py-3 text-left">Show Time</th>
                            <th className="px-6 py-3 text-left">Seats</th>
                            <th className="px-6 py-3 text-left">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((item, index) => (
                            <tr
                                key={index}
                                className="border-b border-white/10 hover:bg-white/5 transition-colors"
                            >
                                <td className="px-6 py-4 font-medium text-white">{item.user.name}</td>
                                <td className="px-6 py-4 font-medium">{item.show.movie.title}</td>
                                <td className="px-6 py-4">{dateFormat(item.show.showDateTime)}</td>
                                <td className="px-6 py-4">{Object.keys(item.bookedSeats).map(seat => item.bookedSeats[seat]).join(", ")}</td>
                                <td className="px-6 py-4 font-semibold text-white">
                                    {currency}{item.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    ) : (
        <Loading />
    );
}

export default ListBookings