import React from 'react';

const InputForm = ({
    label,
    className = '',
    labelClass = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className={`block text-sm 2xl:text-base mb-1 customtext-neutral-dark ${labelClass}`}>
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300 ${className}`}
                {...props}
            />
        </div>
    );
};

export default InputForm;
