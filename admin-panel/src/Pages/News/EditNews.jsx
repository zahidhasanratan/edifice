import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    publishDate: '',
    shortDetails: '',
    featuredPhoto: '',
    description: '',
  });

  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const editorRef = useRef();
  const editorInstanceRef = useRef();
  const [editorReady, setEditorReady] = useState(false); // ✅ flag to initialize editor only once with data

  // Step 1: Fetch data first
  useEffect(() => {
    fetch(`http://localhost:5000/api/news/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          ...data,
          publishDate: data.publishDate?.slice(0, 10),
        });
        setEditorReady(true); // ✅ now CKEditor can safely initialize
      })
      .catch((err) => {
        console.error('Error fetching news:', err);
        Swal.fire('Error!', 'Failed to fetch news data', 'error');
      });
  }, [id]);

  // Step 2: Load CKEditor dynamically and bind it after data load
  useEffect(() => {
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
      if (editorRef.current && !editorInstanceRef.current && editorReady) {
        window.ClassicEditor
          .create(editorRef.current)
          .then((editor) => {
            editor.setData(form.description || '');
            editor.model.document.on('change:data', () => {
              const data = editor.getData();
              setForm((prev) => ({ ...prev, description: data }));
            });
            editorInstanceRef.current = editor;
          })
          .catch((error) => {
            console.error('CKEditor Error:', error);
          });
      }
    };

    if (editorReady) {
      loadEditor();
    }

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().catch(console.error);
        editorInstanceRef.current = null;
      }
    };
  }, [editorReady]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePhotoChange = (e) => {
    setNewPhotoFile(e.target.files[0]);
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
      let photoUrl = form.featuredPhoto;
      if (newPhotoFile) {
        photoUrl = await uploadImageToImgbb(newPhotoFile);
      }

      const payload = {
        ...form,
        featuredPhoto: photoUrl,
      };

      const res = await fetch(`http://localhost:5000/api/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result._id || result.updatedAt) {
        Swal.fire('Success!', 'News updated successfully!', 'success').then(() => {
          navigate('/news');
        });
      } else {
        Swal.fire('Error!', 'Update failed.', 'error');
      }
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire('Error!', error.message, 'error');
    }
  };

  return (
    <div className="max-w-3xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Edit News Article</h2>
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

        {form.featuredPhoto && (
          <img
            src={form.featuredPhoto}
            alt="Current"
            className="object-cover w-40 h-24 border rounded"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full file-input file-input-bordered"
        />

        <label className="font-medium">News Description</label>
        <div ref={editorRef} />

        <button type="submit" className="w-full btn btn-primary">
          Update News
        </button>
      </form>
    </div>
  );
};

export default EditNews;
