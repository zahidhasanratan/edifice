import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const AdminConsentList = () => {
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Error state

  useEffect(() => {
    fetchConsents();
  }, [page, searchQuery]);

  const fetchConsents = async () => {
    setLoading(true);
    setErrorMessage(''); // Reset error message before making a new request
    try {
      const res = await fetch(`https://edifice-tau.vercel.app/api/consents?page=${page}&q=${searchQuery}`);
      const data = await res.json();
      console.log("Fetched consent data:", data);  // Log the data from backend

      if (data.success) {
        setConsents(data.data || []);  // Ensure data is in the expected format
        setTotalPages(data.totalPages || 1);
      } else {
        setErrorMessage('No consent records found.');
      }
    } catch (err) {
      console.error('Error fetching consent records:', err);
      setErrorMessage('Failed to fetch consent records. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (visitorId) => {
    const confirm = await Swal.fire({
      title: 'Delete Consent?',
      text: 'Are you sure you want to delete this consent record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://edifice-tau.vercel.app/api/consents/${visitorId}`, {
          method: 'DELETE',
        });

        const result = await res.json();
        if (result.success) {
          Swal.fire('Deleted!', 'Consent record has been removed.', 'success');
          fetchConsents();  // Re-fetch after deleting
        } else {
          Swal.fire('Error!', 'Something went wrong while deleting.', 'error');
        }
      } catch (error) {
        console.error('Delete error:', error);
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to page 1 when searching
  };

  const handlePagination = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* 🔹 Top Bar */}
      <div className="flex flex-col items-center justify-between gap-3 mb-6 md:flex-row">
        <h2 className="text-2xl font-bold">Cookie Consent Records</h2>
        <div className="flex flex-col items-center w-full gap-2 md:flex-row md:w-auto">
          <input
            type="text"
            placeholder="Search consent records..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full input input-bordered md:w-64"
          />
        </div>
      </div>

      {/* 🧾 Table */}
      {loading && <div className="text-center">Loading...</div>}

      {errorMessage && !loading && (
        <div className="text-center text-red-500">{errorMessage}</div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table w-full">
          <thead className="text-sm text-gray-700 bg-base-200">
            <tr>
              <th>Visitor ID</th>
              <th>Consent Status</th>
              <th>Consent Date</th>
              <th>User Agent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {consents.length > 0 ? (
              consents.map((consent) => (
                <tr key={consent.visitorId}>
                  <td>{consent.visitorId}</td>
                  <td>{consent.consent ? 'Accepted' : 'Declined'}</td>
                  <td>{new Date(consent.createdAt).toLocaleString()}</td>
                  <td>{consent.userAgent}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleDelete(consent.visitorId)}
                      className="btn btn-xs btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No consent records found.
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

export default AdminConsentList;
