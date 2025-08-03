import AOS from "aos";
import { useEffect } from "react";

const AboutSection = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
        });
    }, []);
    return (
        <section className="bg-white text-black dark:bg-black dark:text-white py-20" data-aos="fade-up">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between gap-10">
                {/* Left Content */}
                <div className="space-y-6">
                    <p className="text-[#c20e35] dark:text-red-600 text-sm uppercase tracking-wide">About Us</p>
                    <h2 className="text-2xl md:text-2xl font-bold leading-tight">
                        We Build Real Value for Your Dream Living
                    </h2>
                    <p className="text-gray-700 dark:text-white text-[14px] leading-[20px]">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua... Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>

                    <p className="text-gray-700 dark:text-white text-[14px] leading-[20px]">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua... Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;