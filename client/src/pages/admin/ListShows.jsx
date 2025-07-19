/* eslint-disable react-hooks/exhaustive-deps */
import Loading from '../../components/Loading';
import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';

const ListShows = () => {

    const { axios, getToken, user } = useAppContext();

    const currency = import.meta.env.VITE_CURRENCY;

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllShows = async () => {
        try {
            const { data } = await axios.get('/api/admin/all-shows', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            setShows(data.shows)
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user) {
            getAllShows();
        }
    }, [user]);

    return !loading ? (
        <>
            <Title text1="List" text2="Shows" />
            <div className="max-w-4xl mt-6 overflow-x-auto bg-black/20 rounded-xl shadow-lg">
                <table className="w-full border-collapse text-sm text-gray-200">
                    <thead>
                        <tr className="bg-black/40 text-white uppercase text-xs tracking-wide">
                            <th className="px-6 py-3 text-left">Movie Name</th>
                            <th className="px-6 py-3 text-left">Show Time</th>
                            <th className="px-6 py-3 text-left">Total Bookings</th>
                            <th className="px-6 py-3 text-left">Earnings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shows.map((show, index) => {
                            const totalSeats = Object.keys(show.occupiedSeats).length;
                            const earnings = totalSeats * show.showPrice;

                            return (
                                <tr
                                    key={index}
                                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-white">{show.movie.title}</td>
                                    <td className="px-6 py-4">{dateFormat(show.showDateTime)}</td>
                                    <td className="px-6 py-4">{totalSeats}</td>
                                    <td className="px-6 py-4 text-white">
                                        {currency}
                                        {earnings}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

        </>
    ) : (
        <Loading />
    );
};

export default ListShows;
