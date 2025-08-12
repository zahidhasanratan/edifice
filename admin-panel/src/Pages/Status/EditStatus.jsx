// src/Pages/Status/EditStatus.jsx
import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

// API base
const API_BASE =
  (import.meta?.env?.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/+$/, "")) ||
  "http://localhost:5000/api";

const EditStatus = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    sequence: "",
    featuredPhoto: null,
    featuredPhotoPreview: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef();
  const editorInstanceRef = useRef();

  // Load CKEditor
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
            // Set initial description if available
            if (form.description) {
              editor.setData(form.description);
            }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.description]);

  // Fetch existing status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/status/${id}`);
        if (!res.ok) throw new Error("Failed to fetch status");
        const data = await res.json();
        setForm({
          title: data.title || "",
          sequence: data.sequence || "",
          featuredPhoto: null,
          featuredPhotoPreview: data.featuredPhoto || "",
          description: data.description || "",
        });
        if (editorInstanceRef.current) {
          editorInstanceRef.current.setData(data.description || "");
        }
      } catch (err) {
        console.error("Error fetching status:", err);
        Swal.fire("Error!", "Failed to load status data.", "error");
      }
    };
    fetchStatus();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const { files } = e.target;
    const file = files?.[0] || null;
    setForm((prev) => ({
      ...prev,
      featuredPhoto: file,
      featuredPhotoPreview: file ? URL.createObjectURL(file) : prev.featuredPhotoPreview,
    }));
  };

  const uploadImageToImgbb = async (file) => {
    if (!file) return null;
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

      let featuredPhotoUrl = form.featuredPhotoPreview;
      if (form.featuredPhoto) {
        featuredPhotoUrl = await uploadImageToImgbb(form.featuredPhoto);
      }

      const payload = {
        title: form.title.trim(),
        sequence: Number(form.sequence),
        featuredPhoto: featuredPhotoUrl,
        description: form.description,
      };

      const res = await fetch(`${API_BASE}/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }

      Swal.fire("Success!", "Status updated successfully", "success").then(() => {
        navigate("/status");
      });
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire("Error!", error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Edit Status</h2>

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
          {form.featuredPhotoPreview && (
            <img
              src={form.featuredPhotoPreview}
              alt="Current Featured"
              className="object-cover w-32 h-20 mb-2 rounded"
            />
          )}
          <input
            type="file"
            accept="image/*"
            name="featuredPhoto"
            onChange={handlePhotoChange}
            className="w-full file-input file-input-bordered"
          />
        </div>

        {/* Description (CKEditor) */}
        <label className="font-medium">Description</label>
        <div ref={editorRef} />

        <button type="submit" className={`w-full btn btn-primary ${isSubmitting ? "btn-disabled" : ""}`}>
          {isSubmitting ? "Updating..." : "Update Status"}
        </button>
      </form>
    </div>
  );
};

export default EditStatus;
