import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const AllNews = () => {
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchNews(controller.signal);
    return () => controller.abort();
  }, [page, search]);

  const fetchNews = async (signal) => {
    try {
      setLoading(true);
      const url = `https://edifice-tau.vercel.app/api/news?page=${page}&search=${encodeURIComponent(
        search
      )}&ts=${Date.now()}`; // cache-buster
      const res = await fetch(url, { cache: 'no-store', signal });
      const data = await res.json();
      setNews(Array.isArray(data.news) ? data.news : []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmation = await Swal.fire({
      title: 'Delete News?',
      text: 'Are you sure you want to delete this news article?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (!confirmation.isConfirmed) return;

    try {
      setDeletingId(id);

      // 1) Optimistically remove from UI
      setNews((prev) => prev.filter((n) => n._id !== id));

      // 2) Hit API
      const res = await fetch(`https://edifice-tau.vercel.app/api/news/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      // Some backends return 204 No Content. Guard for that:
      let result = {};
      try {
        result = await res.json();
      } catch (_) {
        // ignore JSON parse error for 204 responses
      }

      if (!res.ok || (result.deletedCount !== undefined && result.deletedCount <= 0)) {
        // Revert UI on failure (optional: re-fetch)
        await Swal.fire('Error', 'Failed to delete the news article.', 'error');
        fetchNews(); // ensure consistency
        return;
      }

      Swal.fire('Deleted!', 'News article has been removed.', 'success');

      // After deletion, ensure we’re not left on an empty page
      // If current page emptied, go back a page and reload.
      if (news.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        // Force a fresh fetch (no cache)
        fetchNews();
      }
    } catch (e) {
      console.error(e);
      Swal.fire('Error', 'Something went wrong while deleting.', 'error');
      fetchNews();
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePagination = (pageNumber) => setPage(pageNumber);

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
            {!loading &&
              news.map((item) => (
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
                  <td>{item.publishDate ? new Date(item.publishDate).toLocaleDateString() : '-'}</td>
                  <td className="flex gap-2">
                    <Link to={`/news/edit/${item._id}`} className="btn btn-xs btn-info">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn btn-xs btn-error"
                      disabled={deletingId === item._id}
                    >
                      {deletingId === item._id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && news.length === 0 && (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No news found.
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td colSpan="4" className="py-6 text-center">
                  Loading…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button onClick={() => handlePagination(page - 1)} className="btn btn-sm" disabled={page === 1 || loading}>
          Previous
        </button>
        <span className="px-3 py-1 text-sm border rounded">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePagination(page + 1)}
          className="btn btn-sm"
          disabled={page === totalPages || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllNews;
