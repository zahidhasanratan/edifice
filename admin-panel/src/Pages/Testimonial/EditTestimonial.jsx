import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditTestimonial = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [clientName, setClientName] = useState("");
  const [designation, setDesignation] = useState("");
  const [photo, setPhoto] = useState(""); // URL of current photo
  const [newPhotoFile, setNewPhotoFile] = useState(null); // if changed
  const [loading, setLoading] = useState(false);

  // Load existing testimonial data
  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/testimonials/${id}`);
        if (!res.ok) throw new Error("Testimonial not found");
        const data = await res.json();
        setTitle(data.title);
        setShortDesc(data.shortDesc);
        setClientName(data.clientName);
        setDesignation(data.designation);
        setPhoto(data.photo);
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    };
    fetchTestimonial();
  }, [id]);

  // Upload image to imgbb
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

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
      let imageUrl = photo;
      if (newPhotoFile) {
        imageUrl = await handleImageUpload(newPhotoFile);
      }

      const updatedTestimonial = {
        title,
        shortDesc,
        clientName,
        designation,
        photo: imageUrl,
      };

      const res = await fetch(`http://localhost:5000/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTestimonial),
      });

      const result = await res.json();

      // Handle both success and fallback when backend doesn't return modifiedCount
      if (res.ok && (result.modifiedCount || result._id || result.success)) {
        await Swal.fire("Success", "Testimonial updated successfully!", "success");
        navigate("/testimonial");
      } else {
        Swal.fire("No Change", "No changes were made.", "info");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl p-6 mx-auto mt-10 bg-white rounded shadow">
      <h2 className="mb-4 text-2xl font-bold text-center">Edit Testimonial</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
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

        <div className="flex items-center gap-4">
          {photo && (
            <img
              src={photo}
              alt="Current"
              className="object-cover w-24 h-16 rounded"
            />
          )}
          <input
            type="file"
            className="file-input file-input-bordered"
            onChange={(e) => setNewPhotoFile(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          className={`btn btn-primary w-full ${loading ? "btn-disabled" : ""}`}
        >
          {loading ? "Updating..." : "Update Testimonial"}
        </button>
      </form>
    </div>
  );
};

export default EditTestimonial;
