import { FaUsers, FaBriefcase, FaEnvelopeOpen, FaCalendarAlt, FaProjectDiagram, FaRocket } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold text-primary">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Visitors */}
        <div className="card w-full bg-primary text-primary-content shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="card-title text-lg">Total Visitors</h2>
                <p className="text-3xl font-bold">15,430</p>
                <p className="text-sm opacity-80">↗︎ 9.4% this month</p>
              </div>
              <FaUsers className="text-4xl opacity-30" />
            </div>
          </div>
        </div>

        {/* Completed Projects */}
        <div className="card w-full bg-green-600 text-green-100 shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="card-title text-lg">Completed Projects</h2>
                <p className="text-3xl font-bold">78</p>
                <p className="text-sm opacity-80">+3 this month</p>
              </div>
              <FaProjectDiagram className="text-4xl opacity-30" />
            </div>
          </div>
        </div>

        {/* Inquiries */}
        <div className="card w-full bg-yellow-500 text-yellow-900 shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="card-title text-lg">New Inquiries</h2>
                <p className="text-3xl font-bold">26</p>
                <p className="text-sm opacity-80">Updated daily</p>
              </div>
              <FaEnvelopeOpen className="text-4xl opacity-30" />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Recent Projects and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Recent Projects</h2>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>Corporate Website for ABC Tech</li>
              <li>Brand Identity Design for Delta Logistics</li>
              <li>Marketing Campaign for HealthZone</li>
              <li>App UI/UX for QuickRide</li>
            </ul>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Upcoming Events</h2>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>Annual Portfolio Review - 28 July</li>
              <li>Client Meeting - 1 August</li>
              <li>Team Workshop: Design Systems - 5 August</li>
              <li>Project Handover: Fusion App - 10 August</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 3: Mission & Vision */}
      <div className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body">
          <h2 className="card-title">Our Mission & Vision</h2>
          <p className="text-sm mt-2">
            We aim to deliver top-notch design and development solutions tailored to our clients' business needs. Our vision is to become a leading creative tech agency known for innovation, collaboration, and impactful experiences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
