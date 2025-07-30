import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AddTeam = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    designation: '',
    sequence: '',
    photo: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
      body: formData
    });

    const data = await res.json();
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = '';
      if (form.photo) {
        imageUrl = await uploadImageToImgbb(form.photo);
      }

      const payload = {
        name: form.name,
        designation: form.designation,
        sequence: parseInt(form.sequence),
        photo: imageUrl
      };

      const res = await fetch('http://localhost:5000/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result._id || result.insertedId) {
        Swal.fire('Success!', 'Team member added successfully', 'success').then(() => {
          navigate('/team'); // ✅ Redirect after success
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
    <div className="max-w-xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Add Team Member</h2>
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
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full file-input file-input-bordered"
          required
        />
        <button type="submit" className="w-full btn btn-primary">
          Add Member
        </button>
      </form>
    </div>
  );
};

export default AddTeam;
