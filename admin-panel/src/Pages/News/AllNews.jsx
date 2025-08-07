import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const AllCareer = () => {
  const [careers, setCareers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCareers();
  }, [page, search]);

  const fetchCareers = async () => {
    try {
      const res = await fetch(
        `https://edifice-tau.vercel.app/api/careers?page=${page}&search=${search}`
      );
      const data = await res.json();
      setCareers(data.careers || data); // in case pagination is not implemented
      setTotalPages(data.totalPages || 1); // fallback if backend doesn't paginate yet
    } catch (err) {
      console.error('Error fetching careers:', err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete Career?',
      text: 'Are you sure you want to delete this career post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://edifice-tau.vercel.app/api/careers/${id}`, {
          method: 'DELETE',
        });

        const result = await res.json();
        if (result.message || result.deletedCount > 0) {
          Swal.fire('Deleted!', 'Career post has been removed.', 'success');
          fetchCareers();
        }
      } catch (error) {
        console.error('Delete error:', error);
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePagination = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* 🔹 Top Bar */}
      <div className="flex flex-col items-center justify-between gap-3 mb-6 md:flex-row">
        <h2 className="text-2xl font-bold">All Careers</h2>
        <div className="flex flex-col items-center w-full gap-2 md:flex-row md:w-auto">
          <input
            type="text"
            placeholder="Search careers..."
            value={search}
            onChange={handleSearchChange}
            className="w-full input input-bordered md:w-64"
          />
          <Link to="/career/add" className="btn btn-primary">
            + Add Career
          </Link>
        </div>
      </div>

      {/* 🧾 Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table w-full">
          <thead className="text-sm text-gray-700 bg-base-200">
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Job Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {careers.map((career) => (
              <tr key={career._id}>
                <td>{career.title}</td>
                <td>{career.location || '—'}</td>
                <td>{career.jobType || '—'}</td>
                <td className="flex gap-2">
                  <Link
                    to={`/career/applicant/${career._id}`}
                    className="btn btn-xs btn-success"
                  >
                    View Applicant
                  </Link>
                  <Link
                    to={`/career/edit/${career._id}`}
                    className="btn btn-xs btn-info"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(career._id)}
                    className="btn btn-xs btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {careers.length === 0 && (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No careers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => handlePagination(page - 1)}
            className="btn btn-sm"
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="font-medium">Page {page} of {totalPages}</span>
          <button
            onClick={() => handlePagination(page + 1)}
            className="btn btn-sm"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllCareer;
