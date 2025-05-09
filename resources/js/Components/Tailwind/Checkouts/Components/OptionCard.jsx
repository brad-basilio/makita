import React from "react";

const OptionCard = ({ title, description, selected, onSelect, disabled }) => {
    return (
        <div
            className={`flex w-full items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-300 customtext-neutral-dark 
                }`}
            onClick={onSelect}
        >
            <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                    selected ? "border-primary" : ""
                }`}
            >
                {selected && (
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                )}
            </div>
            <div className="customtext-neutral-light">
                <h4 className="text-sm ">{title}</h4>
                <p className="text-xs">{description}</p>
            </div>
        </div>
    );
};

export default OptionCard;
