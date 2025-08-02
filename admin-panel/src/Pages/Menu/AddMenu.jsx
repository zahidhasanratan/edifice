import React, { useState } from 'react';
import Swal from 'sweetalert2';

export const AddMenu = () => {
  const [form, setForm] = useState({
    menu_name: '',
    root_id: '',
    sroot_id: '',
    troot_id: '',
    page_type: '',
    external_link: '',
    sequence: '',
    target: '',
    display: false,
    footer1: false,
    footer2: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (res.ok) {
        Swal.fire('Success', 'Menu created successfully', 'success');
        setForm({ menu_name: '', root_id: '', sroot_id: '', troot_id: '', page_type: '', external_link: '', sequence: '', target: '', display: false, footer1: false, footer2: false });
      } else {
        Swal.fire('Error', result.message || 'Something went wrong', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Network error', 'error');
    }
  };

  return (
    <div className="max-w-2xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Add Menu</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input className="input input-bordered" name="menu_name" placeholder="Menu Name" value={form.menu_name} onChange={handleChange} required />

        <input className="input input-bordered" name="root_id" placeholder="Parent Menu ID" value={form.root_id} onChange={handleChange} />
        <input className="input input-bordered" name="sroot_id" placeholder="Sub Menu ID" value={form.sroot_id} onChange={handleChange} />
        <input className="input input-bordered" name="troot_id" placeholder="Last Menu ID" value={form.troot_id} onChange={handleChange} />

        <select className="select select-bordered" name="page_type" value={form.page_type} onChange={handleChange}>
          <option value="">Select Page Type</option>
          <option value="page">Page</option>
          <option value="Service">Service</option>
          <option value="gallery">Picture Gallery</option>
          <option value="video">Video Gallery</option>
          <option value="contact">Contact Us</option>
          <option value="url">URL</option>
        </select>

        <input className="input input-bordered" name="external_link" placeholder="External Link" value={form.external_link} onChange={handleChange} />
        <input className="input input-bordered" name="sequence" type="number" placeholder="Sequence" value={form.sequence} onChange={handleChange} />

        <select className="select select-bordered" name="target" value={form.target} onChange={handleChange}>
          <option value="">Select Target</option>
          <option value="_self">Same Window</option>
          <option value="_blank">New Window</option>
        </select>

        <label className="flex items-center space-x-2">
          <input type="checkbox" name="display" checked={form.display} onChange={handleChange} />
          <span>Main</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="footer1" checked={form.footer1} onChange={handleChange} />
          <span>Footer 1</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="footer2" checked={form.footer2} onChange={handleChange} />
          <span>Footer 2</span>
        </label>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};
