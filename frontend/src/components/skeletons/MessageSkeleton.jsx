import React from 'react';

const MessageSkeleton = () => {
    const skeletonMessages = Array(6).fill(null);

    return (
        <div className="flex flex-col space-y-4 p-4 overflow-y-auto">
            {skeletonMessages.map((_, index) => (
                <div key={index} className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                    {/* Avatar Skeleton */}
                    <div className="flex items-start space-x-2">
                        <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>

                        {/* Message Skeleton */}
                        <div className="flex flex-col space-y-2">
                            <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                            <div className="h-16 w-[200px] bg-gray-300 rounded-lg animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageSkeleton;
