import React from 'react';

const Logo = ({ className = "w-8 h-8", textClassName = "text-xl" }) => {
    return (
        <div className="flex items-center gap-2.5 select-none">
            <div className={`relative flex items-center justify-center ${className}`}>
                <img
                    src="/vantage_logo_icon.png"
                    alt="Vantage Icon"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
            </div>
            <span className={`font-display font-bold tracking-tight text-white ${textClassName}`}>
                Vantage
            </span>
        </div>
    );
};

export default Logo;
