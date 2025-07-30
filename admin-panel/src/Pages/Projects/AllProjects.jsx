import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setFilteredProjects(data);
      })
      .catch(err => console.error('Error fetching projects:', err));
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the project!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          const updated = projects.filter(p => p._id !== id);
          setProjects(updated);
          setFilteredProjects(updated);
          Swal.fire('Deleted!', 'Project has been deleted.', 'success');
        } else {
          Swal.fire('Error!', 'Failed to delete project.', 'error');
        }
      } catch (err) {
        console.error('Delete error:', err);
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setCurrentPage(1);
    const filtered = projects.filter(project =>
      project.title.toLowerCase().includes(query) ||
      project.subtitle.toLowerCase().includes(query)
    );
    setFilteredProjects(filtered);
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <div className="flex flex-col items-start justify-between mb-4 md:flex-row md:items-center">
        <h2 className="mb-2 text-2xl font-bold md:mb-0">All Projects</h2>
        <input
          type="text"
          placeholder="Search by Title or Subtitle"
          value={search}
          onChange={handleSearch}
          className="w-full max-w-xs input input-bordered"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Subtitle</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map(project => (
              <tr key={project._id}>
                <td>
                  {project.featureImage ? (
                    <img
                      src={project.featureImage}
                      alt={project.title}
                      className="object-cover w-24 h-16 rounded"
                    />
                  ) : (
                    <span className="text-sm text-gray-400">No Image</span>
                  )}
                </td>
                <td>{project.title}</td>
                <td>{project.subtitle}</td>
                <td>
                  <span className="badge badge-info">{project.projectType}</span>
                </td>
                <td className="space-x-2">
                  <Link to={`/projects/edit/${project._id}`} className="btn btn-sm btn-primary">Edit</Link>
                  <button onClick={() => handleDelete(project._id)} className="btn btn-sm btn-error">Delete</button>
                </td>
              </tr>
            ))}
            {currentProjects.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(totalPages).keys()].map((number) => (
            <button
              key={number + 1}
              onClick={() => setCurrentPage(number + 1)}
              className={`btn btn-sm ${currentPage === number + 1 ? 'btn-primary' : 'btn-outline'}`}
            >
              {number + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
