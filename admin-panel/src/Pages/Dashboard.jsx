import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaEnvelopeOpen,
  FaProjectDiagram,
  FaBars,
  FaFileAlt,
  FaPhotoVideo,
  FaImage,
  FaQuoteRight,
  FaBuilding,
  FaNewspaper,
  FaFolderOpen,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);
  const [ongoingProjects, setOngoingProjects] = useState(0);
  const [upcomingProjects, setUpcomingProjects] = useState(0);
  const [stats] = useState({
    growth: 9.4,
    newInquiries: 26, // Make dynamic later
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("https://edifice-tau.vercel.app/api/projects");
        const data = await res.json();
        setCompletedProjects(data.filter(p => p.projectType === "Completed").length);
        setOngoingProjects(data.filter(p => p.projectType === "Ongoing").length);
        setUpcomingProjects(data.filter(p => p.projectType === "Upcoming").length);
      } catch (err) {
        console.error("❌ Failed to fetch project stats:", err);
      }
    };

    const fetchVisitorCount = async () => {
      try {
        const res = await fetch("https://edifice-tau.vercel.app/api/visitors/count");
        const data = await res.json();
        setVisitorCount(data.count || 0);
      } catch (err) {
        console.error("❌ Failed to fetch visitor count:", err);
      }
    };

    fetchProjects();
    fetchVisitorCount();
  }, []);

  return (
    <div className="px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold text-primary">Dashboard Overview</h1>

      {/* 📊 Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 🟦 Total Visitors */}
        <div className="w-full transition-transform duration-300 shadow-md card bg-primary text-primary-content hover:shadow-xl hover:scale-105">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg card-title">Total Visitors</h2>
                <p className="text-3xl font-bold">{visitorCount.toLocaleString()}</p>
                <p className="text-sm opacity-80">↗︎ {stats.growth}% this month</p>
              </div>
              <FaUsers className="text-4xl opacity-30" />
            </div>
          </div>
        </div>

        {/* ✅ Completed Projects */}
        <div className="w-full text-green-100 transition-transform duration-300 bg-green-600 shadow-md card hover:shadow-xl hover:scale-105">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg card-title">Completed Projects</h2>
                <p className="text-3xl font-bold">{completedProjects}</p>
                <p className="text-sm opacity-80">✔ This month</p>
              </div>
              <FaProjectDiagram className="text-4xl opacity-30" />
            </div>
          </div>
        </div>

        {/* 🔵 Ongoing Projects */}
        <div className="w-full text-blue-100 transition-transform duration-300 bg-blue-600 shadow-md card hover:shadow-xl hover:scale-105">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg card-title">Ongoing Projects</h2>
                <p className="text-3xl font-bold">{ongoingProjects}</p>
                <p className="text-sm opacity-80">In progress</p>
              </div>
              <FaProjectDiagram className="text-4xl opacity-30" />
            </div>
          </div>
        </div>

        {/* 🟣 Upcoming Projects */}
        <div className="w-full text-purple-100 transition-transform duration-300 bg-purple-600 shadow-md card hover:shadow-xl hover:scale-105">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg card-title">Upcoming Projects</h2>
                <p className="text-3xl font-bold">{upcomingProjects}</p>
                <p className="text-sm opacity-80">Planned ahead</p>
              </div>
              <FaProjectDiagram className="text-4xl opacity-30" />
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 Quick Access */}
      <div className="border shadow-md card bg-base-100 border-base-300">
        <div className="card-body">
          <h2 className="card-title">Quick Access Modules</h2>
          <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-3 lg:grid-cols-4">
            <Link to="/menu" className="flex items-center gap-2 btn btn-outline btn-primary">
              <FaBars /> Menu
            </Link>
            <Link to="/page" className="flex items-center gap-2 btn btn-outline btn-secondary">
              <FaFileAlt /> Page
            </Link>
            <Link to="/media" className="flex items-center gap-2 btn btn-outline btn-accent">
              <FaPhotoVideo /> Media
            </Link>
            <Link to="/sliders" className="flex items-center gap-2 btn btn-outline btn-success">
              <FaImage /> Banners
            </Link>
            <Link to="/testimonial" className="flex items-center gap-2 btn btn-outline btn-warning">
              <FaQuoteRight /> Testimonials
            </Link>
            <Link to="/team" className="flex items-center gap-2 btn btn-outline btn-info">
              <FaUsers /> Team
            </Link>
            <Link to="/projects" className="flex items-center gap-2 btn btn-outline btn-error">
              <FaBuilding /> Projects
            </Link>
            <Link to="/news" className="flex items-center gap-2 btn btn-outline btn-neutral">
              <FaNewspaper /> News
            </Link>
            <Link to="/albums" className="flex items-center gap-2 btn btn-outline btn-primary">
              <FaFolderOpen /> Albums
            </Link>
            <Link to="/photos" className="flex items-center gap-2 btn btn-outline btn-secondary">
              <FaPhotoVideo /> Photos
            </Link>
            <Link to="/about/edit" className="flex items-center gap-2 btn btn-outline btn-info">
              <FaFileAlt /> About Page
            </Link>
            <Link to="/contact/edit" className="flex items-center gap-2 btn btn-outline btn-success">
              <FaFileAlt /> Contact Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
