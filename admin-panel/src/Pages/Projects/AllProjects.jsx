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

  const indexOfLast = currentPage * projectsPerPage;
  const indexOfFirst = indexOfLast - projectsPerPage;
  const currentItems = filteredProjects.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* 🔹 Top Bar */}
      <div className="flex flex-col items-center justify-between gap-3 mb-6 md:flex-row">
        <h2 className="text-2xl font-bold">All Projects</h2>
        <div className="flex flex-col items-center w-full gap-2 md:flex-row md:w-auto">
          <input
            type="text"
            placeholder="Search by Title or Subtitle"
            value={search}
            onChange={handleSearch}
            className="w-full input input-bordered md:w-64"
          />
          <Link to="/projects/add" className="btn btn-primary">
            + Add Project
          </Link>
        </div>
      </div>

      {/* 🧾 Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table w-full">
          <thead className="text-sm text-gray-700 bg-base-200">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Subtitle</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(project => (
              <tr key={project._id}>
                <td>
                  {project.featureImage ? (
                    <img
                      src={project.featureImage}
                      alt={project.title}
                      className="object-cover w-24 h-16 rounded shadow"
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
                  <Link to={`/projects/edit/${project._id}`} className="text-white btn btn-xs btn-info">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-white btn btn-xs btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
