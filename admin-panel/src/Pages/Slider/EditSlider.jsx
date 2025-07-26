// src/Pages/Slider/EditSlider.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditSlider = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [slider, setSlider] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [status, setStatus] = useState(true);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/sliders/${id}`);
        const data = await res.json();
        setSlider(data);
        setTitle(data.title || "");
        setSubtitle(data.subtitle || "");
        setStatus(data.status ?? true);
      } catch (error) {
        Swal.fire("Error", "Failed to load slider data", "error");
      }
    };
    fetchSlider();
  }, [id]);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data?.data?.url;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = slider.image;
      if (image) {
        imageUrl = await handleImageUpload(image);
      }

      const updatedSlider = {
        title,
        subtitle,
        status,
        image: imageUrl,
      };

      const res = await fetch(`http://localhost:5000/api/sliders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSlider),
      });

      const result = await res.json();

      if (result.updatedId || result.modifiedCount > 0 || result.acknowledged) {
        await Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Slider updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/sliders");
      } else {
        Swal.fire("Notice", "No changes were made.", "info");
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to update", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!slider) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Slider</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="input input-bordered w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Subtitle"
          className="input input-bordered w-full"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
        <div className="flex gap-4 items-center">
          <img
            src={slider.image}
            alt="Current"
            className="w-24 h-12 rounded object-cover"
          />
          <input
            type="file"
            className="file-input file-input-bordered"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <select
          className="select select-bordered w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value === "true")}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button type="submit" className="btn btn-primary w-full">
          {loading ? "Updating..." : "Update Slider"}
        </button>
      </form>
    </div>
  );
};

export default EditSlider;
