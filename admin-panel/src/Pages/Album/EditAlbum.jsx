import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

export const EditAlbum = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    coverPhoto: '',
  });

  const [newPhotoFile, setNewPhotoFile] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/albums/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm(data);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        Swal.fire('Error!', 'Failed to load album.', 'error');
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      let photoUrl = form.coverPhoto;
      if (newPhotoFile) {
        photoUrl = await uploadImageToImgbb(newPhotoFile);
      }

      const payload = {
        title: form.title,
        coverPhoto: photoUrl,
      };

      const res = await fetch(`http://localhost:5000/api/albums/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result._id || result.updatedAt) {
        Swal.fire('Success!', 'Album updated successfully.', 'success').then(() =>
          navigate('/albums')
        );
      } else {
        Swal.fire('Error!', 'Update failed.', 'error');
      }
    } catch (err) {
      console.error('Update error:', err);
      Swal.fire('Error!', err.message, 'error');
    }
  };

  return (
    <div className="max-w-xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Edit Photo Album</h2>
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

        {form.coverPhoto && (
          <img
            src={form.coverPhoto}
            alt="Cover"
            className="object-cover w-32 h-20 border rounded"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full file-input file-input-bordered"
        />

        <button type="submit" className="w-full btn btn-primary">
          Update Album
        </button>
      </form>
    </div>
  );
};
