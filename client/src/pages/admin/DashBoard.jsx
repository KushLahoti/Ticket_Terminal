/* eslint-disable react-hooks/exhaustive-deps */
import Loading from '../../components/Loading';
import {
    ChartLineIcon,
    CircleDollarSignIcon,
    PlayCircleIcon,
    StarIcon,
    UsersIcon,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const DashBoard = () => {

    const { axios, getToken, user, image_base_url } = useAppContext();

    const currency = import.meta.env.VITE_CURRENCY;

    const [dashBoardData, setDashBoardData] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        activeShows: [],
        totalUsers: 0,
    });

    const [loading, setLoading] = useState(true);

    const dashBoardCards = [
        {
            title: 'Total Bookings',
            value: dashBoardData.totalBookings || '0',
            icon: ChartLineIcon,
        },
        {
            title: 'Total Revenue',
            value: `${currency}${Number(dashBoardData.totalRevenue || 0).toFixed(2)}`,
            icon: CircleDollarSignIcon,
        },
        {
            title: 'Active Shows',
            value: dashBoardData.activeShows.length || '0',
            icon: PlayCircleIcon,
        },
        {
            title: 'Total Users',
            value: dashBoardData.totalUsers || '0',
            icon: UsersIcon,
        },
    ];

    const fetchDashBoardData = async () => {
        try {
            const { data } = await axios.get('/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                setDashBoardData(data.dashboardData)
                setLoading(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Error fetching dashboard data: ', error)
        }
    };

    useEffect(() => {
        if (user) {
            fetchDashBoardData();
        }
    }, [user]);

    return !loading ? (
        <>
            <Title text1="Admin" text2="Dashboard" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {dashBoardCards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between shadow hover:shadow-lg transition-all"
                    >
                        <div>
                            <h2 className="text-sm text-gray-400">{card.title}</h2>
                            <p className="text-xl font-semibold text-white mt-1">
                                {card.value}
                            </p>
                        </div>
                        <card.icon className="w-7 h-7 text-red-500" />
                    </div>
                ))}
            </div>

            <h2 className="mt-10 mb-4 text-lg font-semibold text-white">
                Active Shows
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {dashBoardData.activeShows.map((show) => (
                    <div
                        key={show._id}
                        className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow hover:shadow-lg hover:-translate-y-1 transition duration-300"
                    >
                        <img
                            src={image_base_url + show.movie.poster_path}
                            alt={show.movie.title}
                            className="w-full h-100 object-cover"
                        />
                        <div className="p-3">
                            <p className="font-semibold text-white truncate">
                                {show.movie.title}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-white">{currency}{show.showPrice}</p>
                                <p className="flex items-center gap-1 text-sm text-gray-300">
                                    <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    {show.movie.vote_average.toFixed(1)}
                                </p>
                            </div>
                            <p className="mt-2 text-sm text-gray-400">
                                {dateFormat(show.showDateTime)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    ) : (
        <Loading />
    );
};

export default DashBoard;
