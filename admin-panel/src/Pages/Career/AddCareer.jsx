import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AddCareer = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    job_summary: '',
    location: '',
    jobFunction: '',
    jobType: '',
    link: '',
    image: null,
  });

  const descriptionRef = useRef();
  const descriptionEditorRef = useRef();

  const jobSummaryRef = useRef();
  const jobSummaryEditorRef = useRef();

  // Load CKEditor from CDN
  useEffect(() => {
    const loadEditor = async () => {
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
            editor.model.document.on('change:data', () => {
              setForm((prev) => ({ ...prev, description: editor.getData() }));
            });
            descriptionEditorRef.current = editor;
          })
          .catch(console.error);
      }

      if (jobSummaryRef.current && !jobSummaryEditorRef.current) {
        window.ClassicEditor.create(jobSummaryRef.current)
          .then((editor) => {
            editor.model.document.on('change:data', () => {
              setForm((prev) => ({ ...prev, job_summary: editor.getData() }));
            });
            jobSummaryEditorRef.current = editor;
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
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
      let imageUrl = '';
      if (form.image) {
        imageUrl = await uploadImageToImgbb(form.image);
      }

      const payload = {
        ...form,
        image: imageUrl,
      };

      const res = await fetch('http://localhost:5000/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result._id || result.insertedId) {
        Swal.fire('Success!', 'Career entry created successfully!', 'success').then(() => {
          navigate('/career');
        });
      } else {
        Swal.fire('Error!', 'Something went wrong!', 'error');
      }
    } catch (err) {
      console.error('Submission error:', err);
      Swal.fire('Error!', err.message, 'error');
    }
  };

  return (
    <div className="max-w-2xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Add Career</h2>
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
          <label className="block mb-1 font-medium">Optional Image</label>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleImageChange}
            className="w-full file-input file-input-bordered"
          />
        </div>

        <button type="submit" className="w-full btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddCareer;
