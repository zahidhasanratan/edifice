import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';

const EditAbout = () => {
  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    featurePhoto: '',
    coverPhoto: '',
    tag1: '',
    tag2: '',
  });

  const [featureFile, setFeatureFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const editorRef = useRef();
  const editorInstanceRef = useRef();

  useEffect(() => {
    fetchAbout();
    loadEditor();
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().catch(console.error);
        editorInstanceRef.current = null;
      }
    };
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/about');
      const data = await res.json();
      if (data) {
        setForm(data);
        setTimeout(() => {
          if (editorInstanceRef.current) {
            editorInstanceRef.current.setData(data.description || '');
          }
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to load About:', err);
    }
  };

  const loadEditor = () => {
    if (!window.ClassicEditor) {
      const script = document.createElement('script');
      script.src = 'https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js';
      script.onload = initEditor;
      document.body.appendChild(script);
    } else {
      initEditor();
    }
  };

  const initEditor = () => {
    if (editorRef.current && !editorInstanceRef.current) {
      window.ClassicEditor
        .create(editorRef.current)
        .then((editor) => {
          editor.model.document.on('change:data', () => {
            const data = editor.getData();
            setForm((prev) => ({ ...prev, description: data }));
          });
          editorInstanceRef.current = editor;
        })
        .catch((error) => console.error('CKEditor Error:', error));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      let featurePhotoUrl = form.featurePhoto;
      let coverPhotoUrl = form.coverPhoto;

      if (featureFile) {
        featurePhotoUrl = await uploadImageToImgbb(featureFile);
      }

      if (coverFile) {
        coverPhotoUrl = await uploadImageToImgbb(coverFile);
      }

      const payload = {
        ...form,
        featurePhoto: featurePhotoUrl,
        coverPhoto: coverPhotoUrl,
      };

      const res = await fetch('http://localhost:5000/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire('Updated!', 'About section updated successfully', 'success');
      } else {
        Swal.fire('Error', result.message || 'Update failed', 'error');
      }
    } catch (err) {
      console.error('Submit error:', err);
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Edit About</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full input input-bordered"
          placeholder="About Title"
          required
        />

        <textarea
          name="shortDescription"
          value={form.shortDescription}
          onChange={handleChange}
          className="w-full textarea textarea-bordered"
          placeholder="Short Description"
          required
        />

        <input
          type="text"
          name="tag1"
          value={form.tag1}
          onChange={handleChange}
          className="w-full input input-bordered"
          placeholder="Tag 1"
        />

        <input
          type="text"
          name="tag2"
          value={form.tag2}
          onChange={handleChange}
          className="w-full input input-bordered"
          placeholder="Tag 2"
        />

        <div>
          <label className="font-medium">Feature Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFeatureFile(e.target.files[0])}
            className="w-full file-input file-input-bordered"
          />
          {form.featurePhoto && (
            <img
              src={form.featurePhoto}
              alt="Feature"
              className="object-cover w-32 h-20 mt-2 rounded"
            />
          )}
        </div>

        <div>
          <label className="font-medium">Cover Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
            className="w-full file-input file-input-bordered"
          />
          {form.coverPhoto && (
            <img
              src={form.coverPhoto}
              alt="Cover"
              className="object-cover w-32 h-20 mt-2 rounded"
            />
          )}
        </div>

        <label className="font-medium">Description</label>
        <div ref={editorRef} />

        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditAbout;
