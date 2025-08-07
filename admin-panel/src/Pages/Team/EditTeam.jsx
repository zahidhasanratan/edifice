import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    designation: '',
    sequence: '',
    photo: '', // URL
  });
  const [newPhotoFile, setNewPhotoFile] = useState(null); // new image

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(`https://edifice-tau.vercel.app/api/team/${id}`);
        const data = await res.json();
        setForm({
          name: data.name,
          designation: data.designation,
          sequence: data.sequence,
          photo: data.photo,
        });
      } catch (err) {
        console.error('Fetch error:', err);
        Swal.fire('Error!', 'Failed to fetch team member.', 'error');
      }
    };

    fetchMember();
  }, [id]);

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
    let photoUrl = form.photo;
    if (newPhotoFile) {
      photoUrl = await uploadImageToImgbb(newPhotoFile);
    }

    const payload = {
      name: form.name,
      designation: form.designation,
      sequence: parseInt(form.sequence),
      photo: photoUrl,
    };

    const res = await fetch(`https://edifice-tau.vercel.app//api/team/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok) {
      Swal.fire('Success!', 'Team member updated successfully', 'success').then(() => {
        navigate('/team');
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
    <div className="max-w-xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Edit Team Member</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full input input-bordered"
          required
        />
        <input
          type="text"
          name="designation"
          value={form.designation}
          onChange={handleChange}
          placeholder="Designation"
          className="w-full input input-bordered"
          required
        />
        <input
          type="number"
          name="sequence"
          value={form.sequence}
          onChange={handleChange}
          placeholder="Sequence Number"
          className="w-full input input-bordered"
          required
        />

        {/* Existing Image */}
        {form.photo && (
          <div>
            <p className="mb-1 font-semibold">Current Photo</p>
            <img
              src={form.photo}
              alt="Current"
              className="object-cover w-24 h-24 mb-2 rounded-full"
            />
          </div>
        )}

        {/* New Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full file-input file-input-bordered"
        />

        <button type="submit" className="w-full btn btn-primary">
          Update Member
        </button>
      </form>
    </div>
  );
};

export default EditTeam;
