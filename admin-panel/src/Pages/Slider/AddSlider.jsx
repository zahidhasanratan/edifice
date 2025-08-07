import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddSlider = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [status, setStatus] = useState(true);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // for redirecting

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (!data.success) {
      throw new Error("Image upload failed");
    }

    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return Swal.fire("Error", "Please select an image", "error");

    setLoading(true);
    try {
      const imageUrl = await handleImageUpload(image);

      const slider = {
        title,
        subtitle,
        image: imageUrl,
        status,
      };

      const res = await fetch("https://edifice-tau.vercel.app/api/sliders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slider),
      });

      const result = await res.json();
      if (result.insertedId) {
        await Swal.fire("Success", "Slider added successfully!", "success");
        navigate("/sliders"); // ✅ Redirect after alert
      } else {
        throw new Error("Failed to insert slider");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl p-6 mx-auto mt-10 bg-white rounded shadow">
      <h2 className="mb-4 text-2xl font-bold text-center">Add New Slider</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full input input-bordered"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Subtitle"
          className="w-full input input-bordered"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
        <input
          type="file"
          className="w-full file-input file-input-bordered"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <select
          className="w-full select select-bordered"
          value={status}
          onChange={(e) => setStatus(e.target.value === "true")}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button type="submit" className="w-full btn btn-primary">
          {loading ? "Uploading..." : "Add Slider"}
        </button>
      </form>
    </div>
  );
};

export default AddSlider;
