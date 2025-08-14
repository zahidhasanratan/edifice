// src/Pages/Status/EditStatus.jsx
import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

// API base
const API_BASE =
  (import.meta?.env?.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/+$/, "")) ||
  "https://edifice-tau.vercel.app/api";

const EditStatus = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    sequence: "",
    featuredPhoto: null,
    featuredPhotoPreview: "",
    coverPhoto: null,
    coverPhotoPreview: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // CKEditor refs
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  // Load CKEditor 5 super-build (includes Alignment + Justify)
  useEffect(() => {
    const initEditor = () => {
      if (!editorRef.current || editorInstanceRef.current) return;

      window.CKEDITOR.ClassicEditor.create(editorRef.current, {
        toolbar: {
          items: [
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "link",
            "|",
            "bulletedList",
            "numberedList",
            "|",
            "alignment", // left/center/right/justify
            "|",
            "outdent",
            "indent",
            "|",
            "blockQuote",
            "insertTable",
            "undo",
            "redo",
          ],
          shouldNotGroupWhenFull: true,
        },
        alignment: {
          options: ["left", "center", "right", "justify"],
        },
        removePlugins: [
          "AIAssistant", "CKBox", "CKFinder", "EasyImage",
          "RealTimeCollaborativeComments", "RealTimeCollaborativeTrackChanges",
          "RealTimeCollaborativeRevisionHistory", "PresenceList", "Comments",
          "TrackChanges", "TrackChangesData", "RevisionHistory",
          "Pagination", "WProofreader", "SlashCommand", "Template",
          "DocumentOutline", "FormatPainter", "TableOfContents",
          "PasteFromOfficeEnhanced", "ExportPdf", "ExportWord",
        ],
      })
        .then((editor) => {
          // React ← editor
          editor.model.document.on("change:data", () => {
            setForm((prev) => ({ ...prev, description: editor.getData() }));
          });

          // If description already loaded from API, push into editor
          if (form.description) {
            editor.setData(form.description);
          }

          editorInstanceRef.current = editor;
        })
        .catch((error) => {
          console.error("CKEditor Error:", error);
          Swal.fire("Editor Error", "Failed to initialize the editor", "error");
        });
    };

    const loadEditor = () => {
      if (window.CKEDITOR?.ClassicEditor) {
        initEditor();
      } else {
        const script = document.createElement("script");
        script.src = "https://cdn.ckeditor.com/ckeditor5/39.0.1/super-build/ckeditor.js";
        script.async = true;
        script.onload = initEditor;
        script.onerror = () => console.error("Failed to load CKEditor super-build");
        document.body.appendChild(script);
      }
    };

    loadEditor();

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().catch(() => {});
        editorInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // initialize once

  // Keep editor in sync when form.description updates (after fetch)
  useEffect(() => {
    const editor = editorInstanceRef.current;
    if (editor && typeof form.description === "string") {
      const current = editor.getData();
      if (current !== form.description) {
        editor.setData(form.description);
      }
    }
  }, [form.description]);

  // Fetch existing status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/status/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch status");
        const data = await res.json();
        setForm({
          title: data.title || "",
          sequence: data.sequence ?? "",
          featuredPhoto: null,
          featuredPhotoPreview: data.featuredPhoto || "",
          coverPhoto: null,
          coverPhotoPreview: data.coverPhoto || "",
          description: data.description || "",
        });
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
    const { name, files } = e.target;
    const file = files?.[0] || null;

    if (name === "featuredPhoto") {
      setForm((prev) => ({
        ...prev,
        featuredPhoto: file,
        featuredPhotoPreview: file ? URL.createObjectURL(file) : prev.featuredPhotoPreview,
      }));
    } else if (name === "coverPhoto") {
      setForm((prev) => ({
        ...prev,
        coverPhoto: file,
        coverPhotoPreview: file ? URL.createObjectURL(file) : prev.coverPhotoPreview,
      }));
    }
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
      if (!form.description || !form.description.trim())
        throw new Error("Description cannot be empty.");
      if (form.sequence === "" || form.sequence === null || form.sequence === undefined)
        throw new Error("Sequence is required.");
      if (isNaN(Number(form.sequence))) throw new Error("Sequence must be a number.");

      // Start with current URLs (from previews set during fetch)
      let featuredPhotoUrl = form.featuredPhotoPreview;
      let coverPhotoUrl = form.coverPhotoPreview;

      // Upload if replaced
      if (form.featuredPhoto) {
        featuredPhotoUrl = await uploadImageToImgbb(form.featuredPhoto);
      }
      if (form.coverPhoto) {
        coverPhotoUrl = await uploadImageToImgbb(form.coverPhoto);
      }

      const payload = {
        title: form.title.trim(),
        sequence: Number(form.sequence),
        featuredPhoto: featuredPhotoUrl,
        description: form.description,
        ...(coverPhotoUrl ? { coverPhoto: coverPhotoUrl } : {}),
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
              className="object-cover w-40 h-24 mb-2 rounded"
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

        {/* Cover Photo (optional) */}
        <div>
          <label className="block mb-1 font-medium">Cover Photo (optional)</label>
          {form.coverPhotoPreview && (
            <img
              src={form.coverPhotoPreview}
              alt="Current Cover"
              className="object-cover w-40 h-24 mb-2 rounded"
            />
          )}
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
        <div
          ref={editorRef}
          className="min-h-[220px] border rounded bg-white"
        />

        <button
          type="submit"
          className={`w-full btn btn-primary ${isSubmitting ? "btn-disabled" : ""}`}
        >
          {isSubmitting ? "Updating..." : "Update Status"}
        </button>
      </form>
    </div>
  );
};

export default EditStatus;
