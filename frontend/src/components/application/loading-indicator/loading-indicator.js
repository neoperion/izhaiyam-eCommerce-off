import React from 'react';

export const LoadingIndicator = ({ label = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] w-full bg-white/50 gap-4 rounded-xl py-12">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-sage-600 rounded-full animate-spin"></div>
            <p className="text-sage-600 font-medium font-inter animate-pulse text-sm tracking-wide">{label}</p>
        </div>
    );
};
