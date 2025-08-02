import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const AllPage = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/pages');
      const data = await res.json();
      setPages(data);
    } catch (err) {
      console.error('Error fetching pages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:5000/api/pages/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          Swal.fire('Deleted!', 'Page has been deleted.', 'success');
          fetchPages(); // Refresh list
        } else {
          Swal.fire('Error!', 'Failed to delete page.', 'error');
        }
      } catch (err) {
        console.error('Delete error:', err);
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-page/${id}`);
  };

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">All Pages</h2>

      {loading ? (
        <p>Loading...</p>
      ) : pages.length === 0 ? (
        <p>No pages found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Sub Title</th>
                <th>Menu Slug</th>
                <th>Cover Photo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page, index) => (
                <tr key={page._id}>
                  <td>{index + 1}</td>
                  <td>{page.title}</td>
                  <td>{page.subTitle || '-'}</td>
                  <td>{page.menuSlug}</td>
                  <td>
                    {page.coverPhoto ? (
                      <img
                        src={page.coverPhoto}
                        alt="cover"
                        className="object-cover w-20 h-12 rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(page._id)}
                      className="btn btn-sm btn-info"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(page._id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
