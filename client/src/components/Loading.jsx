/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Loading = () => {

    const { nextUrl } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (nextUrl) {
            setTimeout(() => {
                navigate('/' + nextUrl)
            }, 8000)
        }
    }, [])

    return (
        <div className='h-screen flex items-center justify-center bg-black text-white'>
            <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 border-solid'></div>
        </div>
    )
}

export default Loading