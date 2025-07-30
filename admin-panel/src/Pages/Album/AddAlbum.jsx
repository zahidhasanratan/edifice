import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const AddAlbum = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    coverPhoto: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        coverPhoto: photoUrl,
      };

      const res = await fetch('http://localhost:5000/api/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result._id || result.insertedId) {
        Swal.fire('Success!', 'Photo album added successfully.', 'success').then(() =>
          navigate('/albums')
        );
      } else {
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error!', error.message, 'error');
    }
  };

  return (
    <div className="max-w-xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Add Photo Album</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Album Title"
          className="w-full input input-bordered"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full file-input file-input-bordered"
          required
        />

        <button type="submit" className="w-full btn btn-primary">
          Add Album
        </button>
      </form>
    </div>
  );
};
