'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export const EditContact = () => {
  const [form, setForm] = useState({
    address: '',
    telephone: '',
    home: '',
    hotline: '',
    email: '',
    mapIframe: '',
  });

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/contactInfo');
      const data = await res.json();
      if (data) setForm(data);
    } catch (err) {
      console.error('Error fetching contact info:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/contactInfo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (res.ok) {
        Swal.fire('Updated!', 'Contact information updated successfully', 'success');
      } else {
        Swal.fire('Error', result.message || 'Update failed', 'error');
      }
    } catch (err) {
      console.error('Error updating contact:', err);
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  return (
    <div className="max-w-3xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Edit Contact Information</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          className="textarea textarea-bordered"
          placeholder="Address"
          rows="3"
        />

        <input
          type="text"
          name="telephone"
          value={form.telephone}
          onChange={handleChange}
          className="input input-bordered"
          placeholder="Telephone"
        />

        <input
          type="text"
          name="home"
          value={form.home}
          onChange={handleChange}
          className="input input-bordered"
          placeholder="Home"
        />

        <input
          type="text"
          name="hotline"
          value={form.hotline}
          onChange={handleChange}
          className="input input-bordered"
          placeholder="Hotline"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="input input-bordered"
          placeholder="Email"
        />

        <textarea
          name="mapIframe"
          value={form.mapIframe}
          onChange={handleChange}
          className="textarea textarea-bordered"
          placeholder="Paste your Google Map iframe code here"
          rows="5"
        />

        <button type="submit" className="mt-4 btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
};
