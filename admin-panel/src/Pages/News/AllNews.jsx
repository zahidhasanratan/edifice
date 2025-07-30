import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const AllNews = () => {
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNews();
  }, [page, search]);

  const fetchNews = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/news?page=${page}&search=${search}`
      );
      const data = await res.json();
      setNews(data.news);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching news:', err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete News?',
      text: 'Are you sure you want to delete this news article?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      const res = await fetch(`http://localhost:5000/api/news/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.deletedCount > 0) {
        Swal.fire('Deleted!', 'News article has been removed.', 'success');
        fetchNews(); // Refresh the list
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 whenever search changes
  };

  const handlePagination = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">All News</h2>

      {/* Search Box */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full input input-bordered"
          placeholder="Search news..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>Featured Photo</th>
              <th>Title</th>
              <th>Publish Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item._id}>
                <td>
                  {item.featuredPhoto ? (
                    <img
                      src={item.featuredPhoto}
                      alt={item.title}
                      className="object-cover w-24 h-16 rounded"
                    />
                  ) : (
                    <span className="text-sm text-gray-400">No Image</span>
                  )}
                </td>
                <td>{item.title}</td>
                <td>{new Date(item.publishDate).toLocaleDateString()}</td>
                <td className="flex gap-2">
                  <Link
                    to={`/news/edit/${item._id}`}
                    className="btn btn-xs btn-info"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="btn btn-xs btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {news.length === 0 && (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No news found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePagination(page - 1)}
          className="btn btn-sm"
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="mx-4">{page}</span>
        <button
          onClick={() => handlePagination(page + 1)}
          className="btn btn-sm"
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllNews;
