import React, { useState, useEffect } from 'react';

const ProjectVideo = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <section className="bg-white dark:bg-black py-16 px-4 md:px-10">
            <div className="mx-auto w-[90%] md:w-[70%] bg-gray-200 dark:bg-gray-800 rounded-xl p-4">
                {isClient ? (
                    <div className="relative pt-[56.25%]">
                        <iframe
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            src="https://www.youtube.com/embed/6biMWgD6_JY?autoplay=0&rel=0"
                            title="Project Video"
                            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div className="bg-gray-400 h-64 flex items-center justify-center">
                        <p>Loading video player...</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProjectVideo;