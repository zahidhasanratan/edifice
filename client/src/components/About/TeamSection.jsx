'use client';

import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
    });
  }, []);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/team');
        const data = await res.json();
        const sorted = data.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
        setTeamMembers(sorted);
      } catch (error) {
        console.error('Failed to fetch team members:', error);
      }
    };

    fetchTeam();
  }, []);

  return (
    <section
      data-aos="fade-up"
      className="py-16 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="text-center mb-10" data-aos="fade-up">
          <p className="text-[#c20e35] text-sm uppercase tracking-wider relative inline-block mb-2 before:content-[''] before:absolute before:-left-4 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-[#c20e35] before:rounded-full">
            Team
          </p>
          <h2 className="relative text-3xl md:text-4xl font-bold text-center mb-6 after:content-[''] after:block after:w-20 after:h-1 after:bg-[#c20e35] after:mx-auto after:mt-4">
            Management
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member._id}
              className="group relative overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={(index % 4) * 100}
            >
              <div className="relative rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform group-hover:scale-105 cursor-pointer">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-[400px] md:h-[350px] object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 w-full bg-[var(--foreground)]/90 text-[var(--background)] p-4 transition-all duration-300 group-hover:bg-opacity-100">
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-[#c20e35]">{member.designation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
