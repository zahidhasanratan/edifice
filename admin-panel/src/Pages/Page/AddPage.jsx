import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AddPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    subTitle: '',
    menuSlug: '',
    description: '',
    coverPhoto: null,
  });

  const [menus, setMenus] = useState([]);
  const editorRef = useRef();
  const editorInstanceRef = useRef();

  useEffect(() => {
    fetchMenus();
    loadEditor();

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().catch(console.error);
        editorInstanceRef.current = null;
      }
    };
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await fetch('https://edifice-tau.vercel.app/api/menus/all');
      const data = await res.json();
      setMenus(data);
    } catch (err) {
      console.error('Error fetching menus:', err);
    }
  };

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
      window.ClassicEditor.create(editorRef.current)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePhotoChange = (e) => {
    setForm({ ...form, coverPhoto: e.target.files[0] });
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
      if (form.coverPhoto) {
        photoUrl = await uploadImageToImgbb(form.coverPhoto);
      }

      const payload = {
        title: form.title,
        subTitle: form.subTitle,
        menuSlug: form.menuSlug,
        description: form.description,
        coverPhoto: photoUrl,
      };

      const res = await fetch('https://edifice-tau.vercel.app/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result._id || result.insertedId) {
        Swal.fire('Success!', 'Page added successfully', 'success').then(() => {
          navigate('/pages');
        });
      } else {
        Swal.fire('Error!', 'Something went wrong', 'error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      Swal.fire('Error!', error.message, 'error');
    }
  };

  // ✅ Recursive function to build indented menu list
  const buildMenuOptions = (menus, parentId = null, level = 0) => {
    let result = [];
    menus
      .filter(menu => String(menu.parent) === String(parentId))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .forEach(menu => {
        result.push({
          ...menu,
          displayName: `${'↳ '.repeat(level)}${menu.menu_name}`,
        });
        result = result.concat(buildMenuOptions(menus, menu._id, level + 1));
      });
    return result;
  };

  return (
    <div className="max-w-2xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Add Page</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Page Title"
          className="w-full input input-bordered"
          required
        />

        <input
          type="text"
          name="subTitle"
          value={form.subTitle}
          onChange={handleChange}
          placeholder="Sub Title"
          className="w-full input input-bordered"
        />

        <select
          name="menuSlug"
          value={form.menuSlug}
          onChange={handleChange}
          className="w-full select select-bordered"
          required
        >
          <option value="">Select Menu</option>
          {buildMenuOptions(menus).map(menu => (
            <option key={menu._id} value={menu.slug}>
              {menu.displayName}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full file-input file-input-bordered"
        />

        <label className="font-medium">Description</label>
        <div ref={editorRef} />

        <button type="submit" className="w-full btn btn-primary">
          Add Page
        </button>
      </form>
    </div>
  );
};

export default AddPage;
