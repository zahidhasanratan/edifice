// src/Pages/Status/AllStatus.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

// Configure your API base
const API_BASE =
  (import.meta?.env?.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/+$/, "")) ||
  "https://edificese.vercel.app/api";

const AllStatus = () => {
  const [statuses, setStatuses] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);            // works if backend supports it
  const [totalPages, setTotalPages] = useState(1); // fallback to 1 if no pagination
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/status?page=${page}&search=${encodeURIComponent(search)}`
      );
      const data = await res.json();

      // When pagination exists: data = { items/careers/statuses, totalPages, ... }
      const items = data.statuses || data.items || data; // fallback to raw array
      // Ensure sequence ascending if backend didn't sort
      const sorted = Array.isArray(items)
        ? [...items].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
        : [];

      setStatuses(sorted);
      setTotalPages(Number(data.totalPages) || 1);
    } catch (err) {
      console.error("Error fetching statuses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Status?",
      text: "Are you sure you want to delete this status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE}/status/${id}`, {
          method: "DELETE",
        });
        const result = await res.json();

        if (result.success || result.message || result.deletedCount > 0) {
          Swal.fire("Deleted!", "Status has been removed.", "success");
          fetchStatuses();
        } else {
          Swal.fire("Error!", result.message || "Delete failed.", "error");
        }
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePagination = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setPage(pageNumber);
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* 🔹 Top Bar */}
      <div className="flex flex-col items-center justify-between gap-3 mb-6 md:flex-row">
        <h2 className="text-2xl font-bold">All Status</h2>
        <div className="flex flex-col items-center w-full gap-2 md:flex-row md:w-auto">
          <input
            type="text"
            placeholder="Search status..."
            value={search}
            onChange={handleSearchChange}
            className="w-full input input-bordered md:w-64"
          />
          <Link to="/status/add" className="btn btn-primary">
            + Add Status
          </Link>
        </div>
      </div>

      {/* 🧾 Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table w-full">
          <thead className="text-sm text-gray-700 bg-base-200">
            <tr>
              <th>Seq</th>
              <th>Featured Photo</th>
              <th>Title</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              statuses.map((item) => (
                <tr key={item._id || item.id}>
                  <td className="font-medium">{item.sequence ?? "—"}</td>
                  <td>
                    {item.featuredPhoto ? (
                      <img
                        src={item.featuredPhoto}
                        alt={item.title || "Status"}
                        className="object-cover w-16 h-10 rounded"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{item.title || "—"}</td>
                  <td>
                    <div className="justify-end gap-2 md:justify-start">
                      <Link
                        to={`/status/edit/${item._id || item.id}`}
                        className="mr-2 btn btn-xs btn-info"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id || item.id)}
                        className="btn btn-xs btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && statuses.length === 0 && (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No status found.
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td colSpan="4" className="py-6 text-center">
                  Loading...
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
          <span className="font-medium">
            Page {page} of {totalPages}
          </span>
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

export default AllStatus;
