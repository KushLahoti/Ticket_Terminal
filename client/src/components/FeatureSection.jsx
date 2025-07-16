import { dummyShowsData } from '../assets/assets.js';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard.jsx';

const FeatureSection = () => {
    const navigate = useNavigate();
    const [favourites, setFavourites] = useState([]);
    useEffect(() => {
        const fav = JSON.parse(localStorage.getItem('favourites')) || [];
        setFavourites(fav);
    }, []);
    const handleToggleFavourite = (movie) => {
        let updatedFavs = [...favourites];
        const index = updatedFavs.findIndex(m => m._id === movie._id);

        if (index !== -1) {
            updatedFavs.splice(index, 1);
        } else {
            updatedFavs.push(movie);
        }

        localStorage.setItem('favourites', JSON.stringify(updatedFavs));
        setFavourites(updatedFavs);
    };
    return (
        <div className='relative z-10 overflow-hidden py-10 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 text-white'>
            <div className="absolute right-0 top-1/4 w-1/2 h-1/2 bg-[#e50914]/30 blur-2xl rounded-full -z-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-[#e50914]/30 backdrop-blur-[2px] -z-10" />

            <div className='relative flex justify-center pt-10 pb-5'>
                <p className='text-gray-300 font-semibold text-3xl'>Now Showing</p>
            </div>

            <div className='flex flex-wrap justify-center gap-8 mt-8'>
                {dummyShowsData.slice(0, 4).map((show) => {
                    const isFav = favourites.some(m => m._id === show._id);
                    return (
                        <MovieCard
                            key={show._id}
                            movie={show}
                            isFavourite={isFav}
                            onToggleFavourite={handleToggleFavourite}
                        />
                    );
                })}
            </div>

            <div className="flex justify-center mt-16">
                <button
                    onClick={() => navigate('/movies')}
                    className="px-6 py-2.5 text-sm text-white bg-[#e50914] hover:bg-[#b40610] transition-colors duration-200 rounded-2xl font-medium shadow-md hover:shadow-lg hover:scale-[1.03] transform cursor-pointer">
                    Show More
                </button>
            </div>
        </div>
    );
};

export default FeatureSection;
