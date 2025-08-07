import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AllSliders = () => {
  const [sliders, setSliders] = useState([]);
  const [filteredSliders, setFilteredSliders] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    const res = await fetch("https://edifice-tau.vercel.app/api/sliders");
    const data = await res.json();
    setSliders(data);
    setFilteredSliders(data);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Slider?",
      text: "Are you sure you want to delete this slider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      const res = await fetch(`https://edifice-tau.vercel.app/api/sliders/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.deletedCount > 0 || result.message === "Slider deleted") {
        Swal.fire("Deleted!", "Slider has been removed.", "success");
        fetchSliders();
      }
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const filtered = sliders.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.subtitle.toLowerCase().includes(query)
    );
    setFilteredSliders(filtered);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredSliders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSliders.length / itemsPerPage);

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* 🔵 Top Bar */}
      <div className="flex flex-col items-center justify-between gap-2 mb-6 md:flex-row">
        <h2 className="text-2xl font-bold">All Sliders</h2>
        <div className="flex flex-col w-full gap-2 sm:flex-row sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by title or subtitle"
            className="w-full input input-bordered sm:w-64"
          />
          <Link to="/sliders/add" className="btn btn-primary">
            + Add Slider
          </Link>
        </div>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table w-full">
          <thead className="text-sm text-gray-700 bg-base-200">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Subtitle</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((slider) => (
              <tr key={slider._id}>
                <td>
                  <img
                    src={slider.image}
                    alt="slider"
                    className="object-cover w-24 h-12 rounded shadow"
                  />
                </td>
                <td>{slider.title}</td>
                <td>{slider.subtitle}</td>
                <td>
                  <span
                    className={`badge px-3 py-1 ${
                      slider.status ? "badge-success" : "badge-neutral"
                    }`}
                  >
                    {slider.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="space-x-1">
                  <Link
                    to={`/sliders/edit/${slider._id}`}
                    className="text-white btn btn-xs btn-info"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(slider._id)}
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
                  No sliders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔢 Pagination */}
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

export default AllSliders;
