import { useAppContext } from '../context/AppContext';
import timeFormat from '../lib/timeFormat';
import { Heart, StarIcon } from 'lucide-react';
import React from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'

const MovieCard = ({ movie, showBuyButton = true }) => {

    const { axios, user, getToken, fetchFavouriteMovies, favouriteMovies, image_base_url } = useAppContext();

    const handleFav = async () => {
        try {
            if (!user) return toast.error("Please login to proceed")

            const { data } = await axios.post('/api/user/update-favourite', { movieId: movie._id }, {
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

    const navigate = useNavigate();

    return (
        <div className='flex flex-col p-3 w-66 justify-between bg-[#141414] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105'>

            <img onClick={() => navigate(`/movies/${movie._id}`)} src={image_base_url + movie.backdrop_path} alt=""
                className='rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer' />
            <p className='font-semibold mt-2 truncate'>{movie.title}</p>
            <p className='text-sm text-gray-300 mt-2'>
                {new Date(movie.release_date).getFullYear()} •
                {movie.genres.slice(0, 2).map(genre => genre.name).join(" | ")} • {timeFormat(movie.runtime)}
            </p>
            <div className='flex items-center justify-between mt-4 pb-3'>
                {showBuyButton && (
                    <button
                        onClick={() => navigate(`/movies/${movie._id}`)}
                        className='mt-2 bg-[#e50914] hover:bg-[#b40610] text-white px-4 py-2 text-sm rounded-md font-medium shadow hover:shadow-lg transition duration-200 ease-in-out cursor-pointer'>
                        Buy Tickets
                    </button>
                )}
                <div className='flex items-center justify-between mt-4 pb-3'>
                    <p className='flex items-center gap-1 text-sm text-gray-300 mt-1 pr-1'>
                        <StarIcon className='w-5 h-5 text-primary fill-primary' />
                        {movie.vote_average.toFixed(1)}
                    </p>
                    <button
                        className='p-1 mt-1 rounded-full transition hover:bg-black/40'
                    >
                        <Heart
                            onClick={handleFav}
                            className={`w-5 h-5 cursor-pointer 
                        ${favouriteMovies.find(show => show._id === movie._id) ? 'fill-red-600 text-red-600' : 'text-white'}`} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MovieCard