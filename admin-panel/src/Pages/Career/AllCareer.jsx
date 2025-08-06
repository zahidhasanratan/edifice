import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const AllCareer = () => {
  const [careers, setCareers] = useState([]);
  const navigate = useNavigate();

  const fetchCareers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/careers');
      const data = await res.json();
      setCareers(data);
    } catch (error) {
      console.error('Error fetching careers:', error);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the career entry.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:5000/api/careers/${id}`, {
          method: 'DELETE',
        });

        const result = await res.json();

        if (res.ok) {
          Swal.fire('Deleted!', 'Career has been deleted.', 'success');
          fetchCareers(); // reload list
        } else {
          Swal.fire('Error', result.message || 'Something went wrong.', 'error');
        }
      } catch (err) {
        console.error('Delete error:', err);
        Swal.fire('Error', 'Something went wrong.', 'error');
      }
    }
  };

  return (
    <div className="panel panel-default">
      <div className="p-4 text-lg font-bold bg-gray-100 border-b panel-heading">
        All Careers
      </div>

      <div className="p-4 panel-body">
        <div className="table-responsive">
          <table className="table w-full text-sm table-striped table-bordered table-hover">
            <thead className="text-left bg-gray-200">
              <tr>
                <th className="p-2">SL.</th>
                <th className="p-2">Title</th>
                <th className="p-2 w-[32%]">Action</th>
              </tr>
            </thead>
            <tbody>
              {careers.map((career, index) => (
                <tr key={career._id} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{career.title}</td>
                  <td className="p-2 space-x-2">
                    <Link
                      to={`/career/applicant/${career._id}`}
                      className="btn btn-info btn-sm"
                    >
                      <i className="fa fa-eye"></i> View Applicant
                    </Link>
                    <Link
                      to={`/career/edit/${career._id}`}
                      className="btn btn-warning btn-sm"
                    >
                      <i className="fa fa-edit"></i> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(career._id)}
                      className="btn btn-danger btn-sm"
                    >
                      <i className="fa fa-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {careers.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No career data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
