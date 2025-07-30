import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export const EditPhoto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [form, setForm] = useState({
    title: '',
    albumId: '',
    imageUrl: '',
    newPhotoFile: null,
  });

  useEffect(() => {
    fetchAlbums();
    fetchPhotoById();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/albums');
      const data = await res.json();
      setAlbums(data);
    } catch (err) {
      console.error('Failed to load albums:', err);
    }
  };

  const fetchPhotoById = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/photos/${id}`);
      if (!res.ok) {
        Swal.fire('Error', 'Photo not found!', 'error');
        return;
      }
      const data = await res.json();
      setForm({
        title: data.title || '',
        albumId: data.album?._id || data.album, // <-- Handles both populated or plain ID
        imageUrl: data.imageUrl,
        newPhotoFile: null,
      });
    } catch (err) {
      Swal.fire('Error', 'Failed to fetch photo data.', 'error');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, newPhotoFile: e.target.files[0] });
  };

  const uploadToImgbb = async (file) => {
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
      let imageUrl = form.imageUrl;

      if (form.newPhotoFile) {
        imageUrl = await uploadToImgbb(form.newPhotoFile);
      }

      const payload = {
        title: form.title,
        album: form.albumId,
        imageUrl,
      };

      const res = await fetch(`http://localhost:5000/api/photos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result._id || result.modifiedCount) {
        Swal.fire('Updated!', 'Photo updated successfully.', 'success').then(() =>
          navigate('/photos')
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
      <h2 className="mb-4 text-2xl font-bold">Edit Photo</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Photo Title"
          className="w-full input input-bordered"
        />

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

        <div className="flex items-center gap-4">
          {form.imageUrl && (
            <img src={form.imageUrl} alt="Old" className="object-cover w-24 h-16 rounded" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full file-input file-input-bordered"
          />
        </div>

        <button type="submit" className="w-full btn btn-primary">
          Update Photo
        </button>
      </form>
    </div>
  );
};
