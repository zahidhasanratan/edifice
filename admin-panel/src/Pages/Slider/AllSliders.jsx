// src/Pages/Slider/AllSliders.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AllSliders = () => {
  const [sliders, setSliders] = useState([]);

  const fetchSliders = async () => {
    const res = await fetch("http://localhost:5000/api/sliders");
    const data = await res.json();
    setSliders(data);
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Slider?",
      text: "Are you sure you want to delete this slider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      const res = await fetch(`http://localhost:5000/api/sliders/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.deletedCount > 0) {
        Swal.fire("Deleted!", "Slider has been removed.", "success");
        fetchSliders();
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">All Sliders</h2>
      <div className="overflow-x-auto">
        <table className="table w-full border border-base-300">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Subtitle</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sliders.map((slider) => (
              <tr key={slider._id}>
                <td>
                  <img src={slider.image} alt="slider" className="w-24 h-12 object-cover rounded" />
                </td>
                <td>{slider.title}</td>
                <td>{slider.subtitle}</td>
                <td>{slider.status ? "Active" : "Inactive"}</td>
                <td>
                    <Link to={`/sliders/edit/${slider._id}`} className="btn btn-xs btn-info mr-2">
                        Edit
                    </Link>
                    <button
                        onClick={() => handleDelete(slider._id)}
                        className="btn btn-xs btn-error"
                    >
                        Delete
                    </button>
                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllSliders;
