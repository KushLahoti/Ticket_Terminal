import React from 'react';

const Title = ({ text1, text2 }) => {
    return (
        <h1 className="text-white text-2xl md:text-3xl font-bold tracking-wide mb-6 drop-shadow-sm">
            {text1}{' '}
            <span className="text-primary underline decoration-2 underline-offset-4">
                {text2}
            </span>
        </h1>
    );
};

export default Title;
