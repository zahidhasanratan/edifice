import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AddNews = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    publishDate: '',
    shortDetails: '',
    featuredPhoto: null,
    description: '',
  });

  const editorRef = useRef();
  const editorInstanceRef = useRef();

  useEffect(() => {
    const loadEditor = async () => {
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
          .then(editor => {
            editor.model.document.on('change:data', () => {
              const data = editor.getData();
              setForm(prev => ({ ...prev, description: data }));
            });
            editorInstanceRef.current = editor;
          })
          .catch(error => console.error('CKEditor Error:', error));
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
    setForm({ ...form, [name]: value });
  };

  const handlePhotoChange = (e) => {
    setForm({ ...form, featuredPhoto: e.target.files[0] });
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
      let photoUrl = '';
      if (form.featuredPhoto) {
        photoUrl = await uploadImageToImgbb(form.featuredPhoto);
      }

      const payload = {
        title: form.title,
        publishDate: form.publishDate,
        shortDetails: form.shortDetails,
        featuredPhoto: photoUrl,
        description: form.description,
      };

      const res = await fetch('http://localhost:5000/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result._id || result.insertedId) {
        Swal.fire('Success!', 'News article added successfully', 'success').then(() => {
          navigate('/news');
        });
      } else {
        Swal.fire('Error!', 'Something went wrong', 'error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      Swal.fire('Error!', error.message, 'error');
    }
  };

  return (
    <div className="max-w-2xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Add News Article</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="News Title"
          className="w-full input input-bordered"
          required
        />

        <input
          type="date"
          name="publishDate"
          value={form.publishDate}
          onChange={handleChange}
          className="w-full input input-bordered"
          required
        />

        <textarea
          name="shortDetails"
          value={form.shortDetails}
          onChange={handleChange}
          placeholder="Short Details"
          className="w-full textarea textarea-bordered"
          required
        ></textarea>

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full file-input file-input-bordered"
        />

        <label className="font-medium">News Description</label>
        <div ref={editorRef} />

        <button type="submit" className="w-full btn btn-primary">
          Add News
        </button>
      </form>
    </div>
  );
};

export default AddNews;
