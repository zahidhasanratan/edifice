import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export const AllPage = () => {
  const [pages, setPages] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pagesPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    filterPages();
  }, [searchTerm, pages]);

  const fetchPages = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/pages');
      const data = await res.json();
      setPages(data);
    } catch (err) {
      console.error('Error fetching pages:', err);
    }
  };

  const filterPages = () => {
    const filtered = pages.filter(
      (page) =>
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (page.subTitle && page.subTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        page.menuSlug.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPages(filtered);
    setCurrentPage(1);
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
          fetchPages();
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

  const startIndex = (currentPage - 1) * pagesPerPage;
  const currentItems = filteredPages.slice(startIndex, startIndex + pagesPerPage);
  const totalPages = Math.ceil(filteredPages.length / pagesPerPage);

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* Title + Add + Search */}
      <div className="flex flex-col justify-between gap-4 mb-6 md:flex-row md:items-center">
        <h2 className="text-2xl font-semibold">All Pages</h2>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            type="text"
            placeholder="Search by title, subtitle or slug..."
            className="input input-bordered"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/page/add" className="btn btn-primary">
            + Add Page
          </Link>
        </div>
      </div>

      {filteredPages.length === 0 ? (
        <p className="text-gray-500">No pages found.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="table w-full">
              <thead className="text-sm text-gray-700 bg-gray-100">
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
                {currentItems.map((page, index) => (
                  <tr key={page._id}>
                    <td>{startIndex + index + 1}</td>
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
                    <td className="flex gap-2">
                      <button
                        onClick={() => handleEdit(page._id)}
                        className="text-white btn btn-sm btn-info"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(page._id)}
                        className="text-white btn btn-sm btn-error"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                className="btn btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="btn btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
