import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const CareerApplicant = () => {
  const { id: jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await fetch(`https://edifice-tau.vercel.app/api/career-applications/job/${jobId}`);
        const data = await res.json();
        setApplicants(data);
        setFilteredApplicants(data);
      } catch (error) {
        console.error('Error fetching applicants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = applicants.filter((applicant) =>
      applicant.fullName.toLowerCase().includes(value) ||
      applicant.email.toLowerCase().includes(value) ||
      applicant.phone.toLowerCase().includes(value)
    );
    setFilteredApplicants(filtered);
    setCurrentPage(1);
  };

  const paginatedApplicants = filteredApplicants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);

  return (
    <div className="panel panel-default">
      <div className="p-4 text-lg font-bold bg-gray-100 border-b panel-heading">
        Applicants for This Job
      </div>

      <div className="p-4 panel-body">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name, email, or phone"
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />

        {loading ? (
          <p>Loading...</p>
        ) : filteredApplicants.length === 0 ? (
          <p className="text-center text-gray-500">No applicants found.</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table w-full text-sm table-striped table-bordered table-hover">
                <thead className="text-left bg-gray-200">
                  <tr>
                    <th className="p-2">SL</th>
                    <th className="p-2">Full Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Phone</th>
                    <th className="p-2">Cover Letter</th>
                    <th className="p-2">Resume</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedApplicants.map((applicant, index) => (
                    <tr key={applicant._id} className="border-b">
                      <td className="p-2">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="p-2">{applicant.fullName}</td>
                      <td className="p-2">{applicant.email}</td>
                      <td className="p-2">{applicant.phone}</td>
                      <td className="p-2 whitespace-pre-line">{applicant.coverLetter}</td>
                      <td className="p-2">
                        <a
                          href={applicant.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          View Resume
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center mt-4 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
