import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddTestimonial = () => {
  const navigate = useNavigate(); // ✅ Moved inside the component

  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [clientName, setClientName] = useState("");
  const [designation, setDesignation] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrl = await handleImageUpload(photo);
      const testimonial = {
        title,
        shortDesc,
        clientName,
        designation,
        photo: imageUrl,
      };

      const res = await fetch("https://edifice-tau.vercel.app/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonial),
      });

      const result = await res.json();

      if (result.insertedId || result._id) {
        await Swal.fire("Success", "Testimonial added!", "success");
        navigate("/testimonial"); // ✅ Make sure the path is correct
      } else {
        throw new Error("Insertion failed");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl p-6 mx-auto mt-10 bg-white rounded shadow">
      <h2 className="mb-4 text-2xl font-bold text-center">Add New Testimonial</h2>
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
          placeholder="Short Description"
          className="w-full input input-bordered"
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Client Name"
          className="w-full input input-bordered"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Designation"
          className="w-full input input-bordered"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          required
        />
        <input
          type="file"
          className="w-full file-input file-input-bordered"
          onChange={(e) => setPhoto(e.target.files[0])}
          required
        />
        <button type="submit" className="w-full btn btn-primary">
          {loading ? "Uploading..." : "Add Testimonial"}
        </button>
      </form>
    </div>
  );
};

export default AddTestimonial;
