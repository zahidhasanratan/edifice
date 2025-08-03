import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
      <div className="relative overflow-hidden h-64">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
          <div>
            <span className="inline-block px-3 py-1 bg-[#c20e35] text-white text-sm rounded-full mb-2">
              {project.status}
            </span>
            <h3 className="text-xl font-bold text-white">{project.title}</h3>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-500 dark:text-gray-300">Location</p>
            <p className="text-gray-900 dark:text-white">{project.location}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-300">Type</p>
            <p className="text-gray-900 dark:text-white">{project.type}</p>
          </div>
        </div>
        <Link 
          to={`/projects/${project.id}`} 
          className="block w-full bg-[#c20e35] hover:bg-[#a00c2d] text-white text-center py-2 rounded-md transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;