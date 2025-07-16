import { dummyShowsData } from '../assets/assets'
import MovieCard from '../components/MovieCard'
import React, { useEffect, useState } from 'react'

const Movies = () => {
    const [favourites, setFavourites] = useState([]);
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('favourites')) || [];
        setFavourites(stored);
        window.scrollTo(0, 0);
    }, [])

    const toggleFavourite = (movie) => {
        const isFav = favourites.some(f => f._id === movie._id);
        const updated = isFav ? favourites.filter(f => f._id !== movie._id) : [...favourites, movie];
        setFavourites(updated);
        localStorage.setItem('favourites', JSON.stringify(updated));
    }

    return dummyShowsData.length > 0 ? (
        <div className='relative mt-20 px-4 md:px-16 lg:px-24 xl:px-32 min-h-[80vh] bg-gradient-to-b from-black via-zinc-900 to-black text-white pb-20'>
            <div className='flex justify-center'>
                <h1 className='text-2xl sm:text-3xl font-semibold my-6 text-center'>Now Showing</h1>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 max-h-[1650px] overflow-y-auto w-full px-4 sm:px-8'>
                {dummyShowsData.map((movie) => (
                    <MovieCard movie={movie} showBuyButton={true} isFavourite={favourites.some(f => f._id === movie._id)}
                        onToggleFavourite={toggleFavourite}
                        key={movie._id} />
                ))}
            </div>
        </div>
    ) : (
        <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-b from-black via-zinc-900 to-black'>
            <h1 className='font-semibold text-3xl text-center'>No Movies Available</h1>
        </div>
    )
}

export default Movies