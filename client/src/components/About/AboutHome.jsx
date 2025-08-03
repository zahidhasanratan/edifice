import { useEffect } from "react";
import AOS from 'aos'
const AboutHome = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
        });
    }, []);
    return (
        <section
            data-aos="fade-up"
            className="bg-white text-black dark:bg-black dark:text-white py-10 md:py-20 "
        >
            <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between gap-10">
                <div className="lg:w-1/2 space-y-6">
                    <p className="text-[#c20e35] dark:text-red-600 text-sm uppercase tracking-wide">
                        About Us
                    </p>
                    <h2 className="text-2xl md:text-5xl font-bold leading-tight">
                        We Build Real Value for Your Dream Living
                    </h2>
                    <p className="text-gray-700 dark:text-white text-[14px] leading-[20px]">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
                    </p>
                    <p className="text-gray-700 dark:text-white text-[14px] leading-[20px]">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
                    </p>
                </div>
                <div className="relative lg:w-[500px]">
                    <img
                        src="https://tunatheme.com/tf/html/quarter-preview/quarter/img/others/7.png"
                        alt="About Image"
                        className="h-[400px] w-auto mx-auto object-contain md:h-full md:w-full md:object-cover rounded-lg shadow-lg aos-init aos-animate"
                        data-aos="fade-up"
                        data-aos-delay="600"
                    />
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-[#c20e35] dark:bg-red-600 text-white dark:text-white px-5 py-3 shadow-lg text-center">
                        <p className="text-sm uppercase tracking-wide">Finished Projects</p>
                        <h3 className="text-4xl font-extrabold tracking-widest">500</h3>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutHome;