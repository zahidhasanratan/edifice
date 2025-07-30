import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const AddPhoto = () => {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [form, setForm] = useState({
    albumId: '',
    title: '',
    photo: null,
  });

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/albums');
        const data = await res.json();
        setAlbums(data);
      } catch (error) {
        console.error('Failed to load albums', error);
      }
    };

    fetchAlbums();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setForm({ ...form, photo: e.target.files[0] });
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
      if (!form.albumId || !form.photo || !form.title.trim()) {
        return Swal.fire('Error', 'Please fill in all fields.', 'error');
      }

      const imageUrl = await uploadImageToImgbb(form.photo);

      const payload = {
        album: form.albumId,
        title: form.title,
        imageUrl,
      };

      const res = await fetch('http://localhost:5000/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result._id) {
        Swal.fire('Success!', 'Photo added successfully.', 'success').then(() =>
          navigate('/photos')
        );
      } else {
        Swal.fire('Error!', 'Failed to add photo.', 'error');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      Swal.fire('Error!', err.message, 'error');
    }
  };

  return (
    <div className="max-w-xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Add Photo</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">

        {/* Title */}
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Photo Title"
          className="w-full input input-bordered"
          required
        />

        {/* Album Dropdown */}
        <select
          name="albumId"
          value={form.albumId}
          onChange={handleChange}
          className="w-full select select-bordered"
          required
        >
          <option value="">Select Album</option>
          {albums.map((album) => (
            <option key={album._id} value={album._id}>
              {album.title}
            </option>
          ))}
        </select>

        {/* File Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full file-input file-input-bordered"
          required
        />

        <button type="submit" className="w-full btn btn-primary">
          Upload Photo
        </button>
      </form>
    </div>
  );
};
