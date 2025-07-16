import React, { useEffect, useState } from 'react'
import { CalendarIcon, ChevronLeft, ChevronRight, ClockIcon } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';

const movies = [
    {
        title: "Inception",
        year: "2010",
        duration: "2h 28m",
        genres: ["Action", "Sci-Fi", "Thriller"],
        description:
            "A thief who steals secrets through dream-sharing technology is given the task of planting an idea.",
        logo: "/assets/inception.jpg",
    },
    {
        title: "Interstellar",
        year: "2014",
        duration: "2h 49m",
        genres: ["Adventure", "Drama", "Sci-Fi"],
        description:
            "A team of explorers travel through a wormhole in space to save humanity.",
        logo: "/assets/interstellar.webp",
    },
    {
        title: "Avengers: Endgame",
        year: "2019",
        duration: "3h 1m",
        genres: ["Action", "Adventure", "Sci-Fi"],
        description:
            "After the devastating events of Infinity War, the Avengers assemble once more in a final stand to restore balance to the universe.",
        logo: "/assets/endgame.jpg",
    }
]

const HeroSection = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % movies.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setIndex((prev) => (prev + 1) % movies.length);
    const prevSlide = () => setIndex((prev) => (prev - 1 + movies.length) % movies.length);

    const current = movies[index];

    const navigate = useNavigate();

    return (
        <div className="relative w-full min-h-screen text-white overflow-hidden">
            <AnimatePresence>
                <motion.img
                    key={current.logo}
                    src={current.logo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    alt={current.title}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
            </AnimatePresence>
            <div className="relative z-10 px-4 md:px-10 pt-40 md:pt-[18%] max-w-5xl">
                <h1 className="text-4xl font-bold mb-2">{current.title}</h1>
                <div className='flex items-center gap-2 text-gray-300 text-sm'>
                    <CalendarIcon className='w-5' />
                    <span>{current.year}</span>
                </div>
                <div className='flex items-center gap-2 text-gray-300 text-sm'>
                    <ClockIcon className='w-5' />
                    <span>{current.duration}</span>
                </div>
                <p className="text-sm text-gray-300 mb-1">
                    {current.genres.join(" | ")}
                </p>
                <p className="text-md text-gray-200 max-w-xl mb-4">{current.description}</p>
                <button
                    onClick={() => navigate('/movies')}
                    className="w-full sm:w-[40%] md:w-[25%] bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                >
                    Explore Movies
                </button>

            </div>
            <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 p-2 rounded-full hover:bg-black/50 transition"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 p-2 rounded-full hover:bg-black/50 transition"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    )
}

export default HeroSection