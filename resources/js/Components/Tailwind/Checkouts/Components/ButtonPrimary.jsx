import React from 'react';

const ButtonPrimary = ({ children, className = '', ...props }) => {
    return (
        <button
            type="button"
            className={`w-full bg-primary font-bold text-white py-3 px-4  hover:opacity-90 hover:shadow-md transition-all duration-300 focus:outline-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default ButtonPrimary;
