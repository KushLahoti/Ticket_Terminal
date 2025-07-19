/* eslint-disable react-hooks/exhaustive-deps */
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import timeFormat from '../lib/timeFormat';
import DateSelect from '../components/DateSelect';
import Loading from '../components/Loading';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import MovieCard from '../components/MovieCard';

const MovieDetails = () => {
    const { id } = useParams();
    const [show, setShow] = useState(null);
    const navigate = useNavigate();

    const { shows, axios, getToken, user, fetchFavouriteMovies, favouriteMovies, image_base_url } = useAppContext();

    const getShow = async () => {
        try {
            const { data } = await axios.get(`/api/show/${id}`);
            if (data.success) {
                setShow(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleFav = async () => {
        try {
            if (!user) return toast.error("Please login to proceed")

            const { data } = await axios.post('/api/user/update-favourite', { movieId: id }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })

            if (data.success) {
                await fetchFavouriteMovies()
                toast.success(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getShow();
        window.scrollTo(0, 0);
    }, [id])

    if (!show) return <Loading />

    return (
        <div className='relative min-h-screen pt-16'>
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20 blur-md z-0 pointer-events-none"
                style={{ backgroundImage: `url(${image_base_url + show.movie.poster_path})` }}
            ></div>
            <div className='relative z-10 px-4 sm:px-8 md:px-10 lg:px-16 xl:px-32 2xl:px-40 py-10 flex flex-col md:flex-row items-center md:items-start gap-8'>
                <div className='flex-shrink-0'>
                    <img src={image_base_url + show.movie.poster_path} alt="" className='w-52 h-80 object-cover rounded-lg shadow-xl' />
                </div>
                <div className='flex flex-col justify-start gap-3 max-w-2xl'>
                    <h1 className='p-2 font-bold text-2xl'>{show.movie.title}</h1>
                    <div className='flex gap-2 text-lg'>
                        <StarIcon className='fill-amber-200' />
                        {show.movie.vote_average.toFixed(1)} User Rating
                    </div>
                    <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>{show.movie.overview}</p>
                    <p className='text-md'>
                        {timeFormat(show.movie.runtime)} • {show.movie.genres.map(genre => genre.name).join(" | ")} • {show.movie.release_date.split(" - ")}
                    </p>
                    <div className='flex items-center flex-wrap gap-5 mt-4 text-xl'>
                        <button className='p-1 flex gap-1 px-2 bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95'>
                            <PlayCircleIcon className='w=6 h-6 mt-0.5' />
                            Watch Trailer
                        </button>
                        <a href="#dateSelect" className='p-1 bg-[#e50914] hover:bg-[#b40610] text-white px-4 rounded-md font-medium shadow hover:shadow-lg transition duration-200 ease-in-out cursor-pointer'>Buy Tickets</a>
                        <button className={`p-2 rounded-full transition cursor-pointer active:scale-95`}
                            onClick={handleFav}>
                            <Heart className={`w-6 h-6 ${favouriteMovies.find(movie => movie._id === id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                        </button>
                    </div>
                </div>
            </div>
            <div className='px-[10%] mb-10'>
                <p className='text-xl font-semibold text-white mt-12 pl-10'>Your Favourite Cast</p>
                <div className='mt-8'>
                    <div className='flex flex-wrap justify-center gap-x-10 gap-y-8'>
                        {show.movie.casts.slice(0, 12).map((cast, index) => (
                            <div key={index} className='flex flex-col items-center text-center w-24'>
                                <img
                                    src={image_base_url + cast.profile_path}
                                    alt={cast.name}
                                    className='rounded-full h-20 w-20 object-cover shadow-md hover:shadow-lg transition'
                                />
                                <p className='font-medium text-xs mt-2 text-white break-words leading-tight'>{cast.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <DateSelect dateTime={show.dateTime} id={id} />
            <div className='pt-16 pb-20 px-4 sm:px-8 md:px-8 lg-px[10%] mx-30 mb-10 text-white bg-white/5 border border-white/10 rounded-xl p-6 md:p-10 shadow-lg'>
                <h2 className='font-semibold text-2xl text-center mb-10'>You May Also Like</h2>
                <div className='flex gap-2'>
                    {shows.slice(0, 4).map((movie, index) => (
                        <MovieCard key={index} movie={movie} showBuyButton={true} />
                    ))}
                </div>
                <div className='flex items-center justify-center mt-10'>
                    <button onClick={() => navigate('/shows')} className='text-center p-2 bg-[#e50914] hover:bg-[#b40610] transition-colors duration-200 rounded-2xl font-medium shadow-md hover:shadow-lg hover:scale-[1.03] transform cursor-pointer'>
                        Show More
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MovieDetails