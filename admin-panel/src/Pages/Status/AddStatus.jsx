// src/Pages/Status/AddStatus.jsx
import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Configure your API base
const API_BASE =
  (import.meta?.env?.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/+$/, "")) ||
  "https://edifice-tau.vercel.app/api";

const AddStatus = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    sequence: "",
    featuredPhoto: null,
    coverPhoto: null,      // NEW
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const editorRef = useRef();
  const editorInstanceRef = useRef();

  useEffect(() => {
    const loadEditor = async () => {
      if (!window.ClassicEditor) {
        const script = document.createElement("script");
        script.src = "https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js";
        script.onload = initEditor;
        document.body.appendChild(script);
      } else {
        initEditor();
      }
    };

    const initEditor = () => {
      if (editorRef.current && !editorInstanceRef.current) {
        window.ClassicEditor.create(editorRef.current)
          .then((editor) => {
            editor.model.document.on("change:data", () => {
              setForm((prev) => ({ ...prev, description: editor.getData() }));
            });
            editorInstanceRef.current = editor;
          })
          .catch((error) => console.error("CKEditor Error:", error));
      }
    };

    loadEditor();

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().catch(console.error);
        editorInstanceRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const { name, files } = e.target;
    const file = files?.[0] || null;
    setForm((prev) => ({ ...prev, [name]: file }));
  };

  const uploadImageToImgbb = async (file) => {
    if (!file) return "";
    const imgbbKey = import.meta.env.VITE_IMGBB_KEY;
    if (!imgbbKey) throw new Error("Missing VITE_IMGBB_KEY in frontend env.");

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data?.success) {
      const msg = data?.error?.message || "Image upload failed";
      throw new Error(msg);
    }
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!form.title.trim()) throw new Error("Title cannot be empty.");
      if (!form.description || !form.description.trim()) throw new Error("Description cannot be empty.");
      if (!form.sequence && form.sequence !== 0) throw new Error("Sequence is required.");
      if (isNaN(Number(form.sequence))) throw new Error("Sequence must be a number.");
      if (!form.featuredPhoto) throw new Error("Please select a Featured Photo.");

      // Upload images
      const featuredPhotoUrl = await uploadImageToImgbb(form.featuredPhoto);
      const coverPhotoUrl = await uploadImageToImgbb(form.coverPhoto); // optional

      // Build payload (omit undefined/empty values automatically)
      const payload = {
        title: form.title.trim(),
        sequence: Number(form.sequence),
        featuredPhoto: featuredPhotoUrl,
        description: form.description,
        ...(coverPhotoUrl ? { coverPhoto: coverPhotoUrl } : {}), // include only if provided
      };

      const res = await fetch(`${API_BASE}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }

      const result = await res.json();

      if (result._id || result.insertedId || result.id) {
        Swal.fire("Success!", "Status added successfully", "success").then(() => {
          navigate("/status");
        });
      } else {
        throw new Error(result.message || "Unknown response from server");
      }
    } catch (error) {
      console.error("Submission error:", error);
      let message = error.message;
      try {
        const parsed = JSON.parse(error.message);
        if (parsed?.message) message = parsed.message;
      } catch (_) {}
      Swal.fire("Error!", message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Add Status</h2>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Title */}
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full input input-bordered"
          required
        />

        {/* Sequence */}
        <input
          type="number"
          name="sequence"
          value={form.sequence}
          onChange={handleChange}
          placeholder="Sequence (e.g., 1, 2, 3)"
          className="w-full input input-bordered"
          min="0"
          step="1"
          required
        />

        {/* Featured Photo */}
        <div>
          <label className="block mb-1 font-medium">Featured Photo</label>
          <input
            type="file"
            accept="image/*"
            name="featuredPhoto"
            onChange={handlePhotoChange}
            className="w-full file-input file-input-bordered"
            required
          />
        </div>

        {/* Cover Photo (optional) */}
        <div>
          <label className="block mb-1 font-medium">Cover Photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            name="coverPhoto"
            onChange={handlePhotoChange}
            className="w-full file-input file-input-bordered"
          />
        </div>

        {/* Description (CKEditor) */}
        <label className="font-medium">Description</label>
        <div ref={editorRef} />

        <button type="submit" className={`w-full btn btn-primary ${isSubmitting ? "btn-disabled" : ""}`}>
          {isSubmitting ? "Submitting..." : "Add Status"}
        </button>
      </form>
    </div>
  );
};

export default AddStatus;
