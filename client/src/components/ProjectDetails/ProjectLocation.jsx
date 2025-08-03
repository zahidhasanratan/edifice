const ProjectLocation = () => {
    return (
        <section className="bg-white text-black dark:bg-black dark:text-white py-16 px-4 md:px-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-[30%] flex items-center">
                    <div className="w-full">
                        <h2 className="w-full text-3xl md:text-4xl font-extrabold uppercase text-[#c20e35] mb-4 tracking-wider leading-snug">
                            Project<br />Location
                        </h2>
                        <p className="text-gray-800 dark:text-gray-300 leading-relaxed">
                            <strong className="dark:text-white">Address:</strong><br />
                            Plot-1136/M-1136/N,<br />
                            Japan Street, Block I,<br />
                            Bashundhara R/A
                        </p>
                    </div>
                </div>
                <div className="w-full md:w-[70%]">
                    <div className="overflow-hidden shadow-lg w-full h-[300px] md:h-[400px] rounded-xl">
                        <iframe
                            className="w-full h-full"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.742075936318!2d90.42857291543165!3d23.75694429469281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a4cc23a73b%3A0x1b4a6d7b21e2bdb4!2sJapan%20St%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1688888888888!5m2!1sen!2sbd"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Project Location on Google Maps"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectLocation;