import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DateSelect = ({ dateTime, id }) => {
    const navigate = useNavigate()
    const [selected, setSelected] = useState(null);

    const onBookHandle = () => {
        if (!selected) {
            return toast('Please Select a date')
        }
        navigate(`/movies/${id}/${selected}`)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div id='dateSelect' className='pt-16 pb-20 px-4 sm:px-8 md:px-16 lg:px-[10%] text-white'>
            <div className='bg-white/5 border border-white/10 rounded-xl p-6 md:p-10 shadow-lg'>
                <div className='text-center mb-6'>
                    <h2 className='text-2xl font-bold'>Choose Booking Date</h2>
                    <p className='text-sm text-gray-400 mt-1'>Select a date to continue booking</p>
                </div>
                <div className='flex items-center justify-center gap-4 flex-wrap mt-6'>
                    <button className='p-2 rounded hover:bg-white/10 transition'>
                        <ChevronLeftIcon className='w-6 h-6 text-white' />
                    </button>
                    <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 max-w-full'>
                        {Object.keys(dateTime).map((date) => {
                            const d = new Date(date);
                            const day = d.getDate();
                            const month = d.toLocaleDateString("en-US", { month: "short" });
                            return (
                                <button
                                    key={date}
                                    onClick={() => {
                                        console.log("Button Clicked! Date: ", date);
                                        setSelected(date);
                                    }}
                                    className={`flex flex-col items-center justify-center h-16 w-16 rounded-lg border transition duration-200 text-white cursor-pointer
                                    ${selected === date ? 'bg-red-600 border-red-600'
                                            : 'bg-white/10 border-white/20 hover:bg-red-600 hover:border-red-600'}`}
                                >
                                    <span className='text-lg font-semibold'>{day}</span>
                                    <span className='text-xs'>{month}</span>
                                </button>
                            );
                        })}
                    </div>
                    <button className='p-2 rounded hover:bg-white/10 transition'>
                        <ChevronRightIcon className='w-6 h-6 text-white' />
                    </button>
                </div>
                <div className='flex justify-center mt-10'>
                    <button onClick={onBookHandle} className='bg-[#e50914] hover:bg-[#b40610] text-white px-6 py-2 rounded-md font-medium shadow-md transition'>
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DateSelect;
