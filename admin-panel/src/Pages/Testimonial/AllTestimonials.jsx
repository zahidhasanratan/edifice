import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AllTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const res = await fetch("http://localhost:5000/api/testimonials");
    const data = await res.json();
    setTestimonials(data);
    setFiltered(data);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Testimonial?",
      text: "Are you sure you want to delete this testimonial?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      const res = await fetch(`http://localhost:5000/api/testimonials/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.deletedCount > 0 || result.message === "Testimonial deleted") {
        Swal.fire("Deleted!", "Testimonial has been removed.", "success");
        fetchTestimonials();
      }
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const result = testimonials.filter((item) =>
      item.title.toLowerCase().includes(query) ||
      item.clientName.toLowerCase().includes(query)
    );
    setFiltered(result);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* 🔹 Top Bar */}
      <div className="flex flex-col items-center justify-between gap-2 mb-6 md:flex-row">
        <h2 className="text-2xl font-bold">All Testimonials</h2>
        <div className="flex flex-col w-full gap-2 sm:flex-row sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by title or client"
            className="w-full input input-bordered sm:w-64"
          />
          <Link to="/testimonial/add" className="btn btn-primary">
            + Add Testimonial
          </Link>
        </div>
      </div>

      {/* 🧾 Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table w-full">
          <thead className="text-sm text-gray-700 bg-base-200">
            <tr>
              <th>Photo</th>
              <th>Title</th>
              <th>Client</th>
              <th>Designation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item._id}>
                <td>
                  <img
                    src={item.photo}
                    alt={item.clientName}
                    className="object-cover rounded-full shadow w-14 h-14"
                  />
                </td>
                <td>{item.title}</td>
                <td>{item.clientName}</td>
                <td>{item.designation}</td>
                <td className="space-x-1">
                  <Link
                    to={`/testimonials/edit/${item._id}`}
                    className="text-white btn btn-xs btn-info"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
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
                  No testimonials found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-1">
          {[...Array(totalPages).keys()].map((n) => (
            <button
              key={n}
              className={`btn btn-sm ${
                currentPage === n + 1 ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setCurrentPage(n + 1)}
            >
              {n + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTestimonials;
