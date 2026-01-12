export const LoadingIndicator = ({ type = "line-simple", size = "md", label = "Loading..." }) => {
    const sizeClasses = {
        sm: "h-1",
        md: "h-2",
        lg: "h-3"
    };

    if (type === "line-simple") {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                {label && (
                    <p className="text-sage-600 font-inter text-sm mb-4">{label}</p>
                )}
                <div className="w-64 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`${sizeClasses[size]} bg-sage-600 rounded-full animate-pulse`}
                        style={{
                            width: '100%',
                            animation: 'loading 3s ease-in-out infinite'
                        }}
                    />
                </div>
                <style>{`
          @keyframes loading {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
          }
        `}</style>
            </div>
        );
    }

    return null;
};
