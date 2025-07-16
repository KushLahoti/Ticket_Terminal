import ReactPlayer from 'react-player';
import { dummyTrailers } from '../assets/assets'
import React, { useEffect, useState } from 'react'
import { PlayCircleIcon } from 'lucide-react';

const TrailerSection = () => {

    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTrailer(prev => {
                const currentIndex = dummyTrailers.findIndex(t => t === prev);
                const nextIndex = (currentIndex + 1) % dummyTrailers.length;
                return dummyTrailers[nextIndex];
            });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className='relative z-10 overflow-hidden py-12 px-4 md:px-16 lg:px-24 xl:px-32 text-white bg-black/90 backdrop-blur-sm'>

            <div className="absolute right-0 top-1/4 w-1/2 h-1/2 bg-[#e50914]/75 blur-2xl rounded-full -z-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60 -z-10" />

            <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-center">
                🎬 Featured Trailers
            </h2>

            <div className='relative mt-6'>
                <ReactPlayer
                    url={currentTrailer.videoUrl}
                    controls={false}
                    className='mx-auto max-w-full' width="960px" height="540px"
                />
            </div>
            <div className='mt-8 flex justify-center gap-6 overflow-x-auto scrollbar-hide pb-2 scroll-smooth snap-x'>
                {dummyTrailers.map((trailer) => (
                    <div key={trailer.image} className='relative min-w-[160px] max-w-[180px]
                     cursor-pointer hover:scale-105 transition-transform duration-200' onClick={() => setCurrentTrailer(trailer)}>
                        <img src={trailer.image} alt="trailer" className='w-full h-auto rounded-lg shadow-lg' />
                        <PlayCircleIcon strokeWidth={1.6} className='absolute inset-0 m-auto w-10 h-10 text-white opacity-80' />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TrailerSection