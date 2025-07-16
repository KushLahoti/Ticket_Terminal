import Loading from '../../components/Loading';
import { dummyShowsData } from '../../assets/assets';
import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react';
import { kConverter } from '../../lib/kConverter';

const AddShows = () => {
    const currency = import.meta.env.VITE_CURRENCY;
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [dateTimeSelection, setDateTimeSelection] = useState({});
    const [dateTimeInput, setDateTimeInput] = useState("");
    const [showPrice, setShowPrice] = useState("");

    const fetchNowPlayingMovies = async () => {
        setNowPlayingMovies(dummyShowsData);
    };

    const handleDateTimeAdd = () => {
        if (!dateTimeInput) return;
        const [date, time] = dateTimeInput.split("T");
        if (!date || !time) return;
        setDateTimeSelection(prev => {
            const times = prev[date] || [];
            if (!times.includes(time)) {
                return { ...prev, [date]: [...times, time] };
            }
            return prev;
        });
    };

    const handleRemoveTime = (date, time) => {
        setDateTimeSelection(prev => {
            const filtered = prev[date].filter(t => t !== time);
            if (filtered.length === 0) {
                const { [date]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [date]: filtered };
        });
    };

    useEffect(() => {
        fetchNowPlayingMovies();
    }, []);

    return nowPlayingMovies.length > 0 ? (
        <>
            <Title text1="Add" text2="Shows" />

            {/* Movie List */}
            <p className="mt-10 text-lg font-medium">Now Playing Movies</p>
            <div className="overflow-x-hidden pb-4 scrollbar-hide">
                <div className="group flex flex-wrap gap-6 mt-4">
                    {nowPlayingMovies.map((movie) => (
                        <div
                            key={movie.id}
                            onClick={() => setSelectedMovie(movie.id)}
                            className={`w-40 cursor-pointer transition duration-300 rounded-lg overflow-hidden bg-white/5 hover:opacity-90 hover:-translate-y-1 ${selectedMovie === movie.id ? 'ring-2 ring-accent' : ''
                                }`}
                        >
                            <img src={movie.poster_path} alt="" className="w-full h-60 object-cover" />
                            <div className="p-2 space-y-1">
                                <p className="font-medium truncate">{movie.title}</p>
                                <p className="text-sm text-gray-400">{movie.release_date}</p>
                                <div className="flex justify-between items-center text-sm text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        {movie.vote_average.toFixed(1)}
                                    </span>
                                    <span>{kConverter(movie.vote_count)} Votes</span>
                                </div>
                            </div>
                            {selectedMovie === movie.id && (
                                <div className="absolute top-2 right-2 bg-accent h-6 w-6 rounded-full flex items-center justify-center">
                                    <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Show Price */}
            <div className="mt-8">
                <label className="block text-sm font-medium mb-2">Show Price</label>
                <div className="inline-flex items-center gap-2 border border-white/20 px-3 py-2 rounded-md bg-white/5">
                    <span className="text-gray-400 text-sm">{currency}</span>
                    <input
                        type="number"
                        min={0}
                        value={showPrice}
                        onChange={(e) => setShowPrice(e.target.value)}
                        placeholder="Enter Show Price"
                        className="bg-transparent outline-none text-white w-24"
                    />
                </div>
            </div>

            {/* Date and Time Input */}
            <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Select Date and Time</label>
                <div className="flex items-center gap-2 border border-white/20 px-3 py-2 rounded-md bg-white/5 w-max">
                    <input
                        type="datetime-local"
                        value={dateTimeInput}
                        onChange={(e) => setDateTimeInput(e.target.value)}
                        className="bg-transparent text-white outline-none"
                    />
                    <button
                        onClick={handleDateTimeAdd}
                        className="bg-accent text-white px-3 py-1.5 rounded hover:opacity-90 transition"
                    >
                        Add Time
                    </button>
                </div>
            </div>

            {/* Selected Date-Times */}
            {Object.keys(dateTimeSelection).length > 0 && (
                <div className="mt-8">
                    <h2 className="mb-2 font-medium text-white">Selected Date-Time</h2>
                    <ul className="space-y-3">
                        {Object.entries(dateTimeSelection).map(([date, times]) => (
                            <li key={date}>
                                <div className="font-semibold text-gray-300">{date}</div>
                                <div className="flex flex-wrap gap-2 mt-1 text-sm">
                                    {times.map((time) => (
                                        <div
                                            key={time}
                                            className="bg-white/10 border border-white/20 text-white px-2 py-1 flex items-center rounded"
                                        >
                                            <span>{time}</span>
                                            <DeleteIcon
                                                onClick={() => handleRemoveTime(date, time)}
                                                className="ml-2 text-red-400 hover:text-red-600 cursor-pointer"
                                                width={15}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Final Submit Button */}
            <button
                className="mt-10 bg-accent text-white font-semibold px-6 py-2 rounded hover:opacity-90 transition cursor-pointer"
            >
                Add Show
            </button>
        </>
    ) : (
        <Loading />
    );
};

export default AddShows;
