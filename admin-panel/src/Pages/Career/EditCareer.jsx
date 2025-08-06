import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const EditCareer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    job_summary: '',
    location: '',
    jobFunction: '',
    jobType: '',
    link: '',
    image: '',
  });

  const [newImage, setNewImage] = useState(null);

  const descriptionRef = useRef();
  const descriptionEditorRef = useRef();

  const jobSummaryRef = useRef();
  const jobSummaryEditorRef = useRef();

  // Load CKEditor from CDN
  useEffect(() => {
    const loadEditor = () => {
      if (!window.ClassicEditor) {
        const script = document.createElement('script');
        script.src = 'https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js';
        script.onload = initEditors;
        document.body.appendChild(script);
      } else {
        initEditors();
      }
    };

    const initEditors = () => {
      if (descriptionRef.current && !descriptionEditorRef.current) {
        window.ClassicEditor.create(descriptionRef.current)
          .then((editor) => {
            descriptionEditorRef.current = editor;
            editor.model.document.on('change:data', () => {
              setForm((prev) => ({
                ...prev,
                description: editor.getData(),
              }));
            });
          })
          .catch(console.error);
      }

      if (jobSummaryRef.current && !jobSummaryEditorRef.current) {
        window.ClassicEditor.create(jobSummaryRef.current)
          .then((editor) => {
            jobSummaryEditorRef.current = editor;
            editor.model.document.on('change:data', () => {
              setForm((prev) => ({
                ...prev,
                job_summary: editor.getData(),
              }));
            });
          })
          .catch(console.error);
      }
    };

    loadEditor();

    return () => {
      if (descriptionEditorRef.current) {
        descriptionEditorRef.current.destroy().catch(console.error);
        descriptionEditorRef.current = null;
      }
      if (jobSummaryEditorRef.current) {
        jobSummaryEditorRef.current.destroy().catch(console.error);
        jobSummaryEditorRef.current = null;
      }
    };
  }, []);

  // Fetch and apply existing data
  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/careers/${id}`);
        const data = await res.json();
        setForm(data);

        // Wait a moment for CKEditor to initialize before setting content
        setTimeout(() => {
          if (descriptionEditorRef.current) {
            descriptionEditorRef.current.setData(data.description || '');
          }
          if (jobSummaryEditorRef.current) {
            jobSummaryEditorRef.current.setData(data.job_summary || '');
          }
        }, 200);
      } catch (error) {
        console.error('Error fetching career:', error);
      }
    };

    fetchCareer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = form.image;

      if (newImage) {
        imageUrl = await uploadImageToImgbb(newImage);
      }

      const payload = { ...form, image: imageUrl };

      const res = await fetch(`http://localhost:5000/api/careers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire('Success!', 'Career updated successfully', 'success').then(() =>
          navigate('/career')
        );
      } else {
        Swal.fire('Error!', result.message || 'Update failed', 'error');
      }
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire('Error!', error.message, 'error');
    }
  };

  return (
    <div className="max-w-2xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Edit Career</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full input input-bordered"
          required
        />

        <label className="font-medium">Description</label>
        <div ref={descriptionRef}></div>

        <label className="font-medium">Job Summary</label>
        <div ref={jobSummaryRef}></div>

        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full input input-bordered"
        />

        <input
          type="text"
          name="jobFunction"
          value={form.jobFunction}
          onChange={handleChange}
          placeholder="Job Function"
          className="w-full input input-bordered"
        />

        <input
          type="text"
          name="jobType"
          value={form.jobType}
          onChange={handleChange}
          placeholder="Job Type"
          className="w-full input input-bordered"
        />

        <input
          type="text"
          name="link"
          value={form.link}
          onChange={handleChange}
          placeholder="URL (if any)"
          className="w-full input input-bordered"
        />

        <div>
          <label className="block mb-1 font-medium">Current Image</label>
          {form.image ? (
            <img src={form.image} alt="Current" className="w-32 h-auto rounded" />
          ) : (
            <span className="text-gray-500">No image uploaded</span>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Change Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleImageChange}
            className="w-full file-input file-input-bordered"
          />
        </div>

        <button type="submit" className="w-full btn btn-primary">
          Update Career
        </button>
      </form>
    </div>
  );
};

export default EditCareer;
