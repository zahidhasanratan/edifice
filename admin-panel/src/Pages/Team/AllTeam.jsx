import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const AllTeam = () => {
  const [team, setTeam] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchTeam = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/team');
      const data = await res.json();
      setTeam(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete Member?',
      text: 'Are you sure you want to delete this member?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      const res = await fetch(`http://localhost:5000/api/team/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.deletedCount > 0) {
        Swal.fire('Deleted!', 'Team member has been removed.', 'success');
        fetchTeam();
      }
    }
  };

  const filteredTeam = team.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTeam.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredTeam.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* 🔹 Top Bar */}
      <div className="flex flex-col items-center justify-between gap-2 mb-6 sm:flex-row">
        <h2 className="text-2xl font-bold">All Team Members</h2>
        <div className="flex flex-col w-full gap-2 sm:flex-row sm:w-auto">
          <input
            type="text"
            placeholder="Search by name or designation..."
            className="w-full input input-bordered sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/team/add" className="btn btn-primary">
            + Add Member
          </Link>
        </div>
      </div>

      {/* 🧾 Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table w-full">
          <thead className="text-sm text-gray-700 bg-base-200">
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Sequence</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((member) => (
              <tr key={member._id}>
                <td>
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="object-cover rounded-full shadow w-14 h-14"
                  />
                </td>
                <td>{member.name}</td>
                <td>{member.designation}</td>
                <td>{member.sequence}</td>
                <td className="space-x-1">
                  <Link
                    to={`/team/edit/${member._id}`}
                    className="text-white btn btn-xs btn-info"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="text-white btn btn-xs btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-400">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
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

export default AllTeam;
