import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AddMenu = () => {
  const [menu_name, setMenuName] = useState('');
  const [parent, setParent] = useState('');
  const [page_type, setPageType] = useState('');
  const [external_link, setExternalLink] = useState('');
  const [target, setTarget] = useState('');
  const [display, setDisplay] = useState(false);
  const [sequence, setSequence] = useState('');
  const [footer1, setFooter1] = useState(false);
  const [footer2, setFooter2] = useState(false);
  const [parentMenus, setParentMenus] = useState([]);

  const navigate = useNavigate();

  // Fetch all top-level menus for parent dropdown
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/menus/all');
        const data = await res.json();
        setParentMenus(data);
      } catch (err) {
        console.error('Error fetching parent menus:', err);
      }
    };

    fetchMenus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMenu = {
      menu_name,
      parent: parent || null,
      page_type,
      external_link,
      target,
      display,
      sequence,
      footer1,
      footer2,
    };

    try {
      const res = await fetch('http://localhost:5000/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMenu),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire('Success!', 'Menu created successfully.', 'success');
        navigate('/menu');
      } else {
        Swal.fire('Error', data.message || 'Something went wrong.', 'error');
      }
    } catch (err) {
      console.error('Error creating menu:', err);
      Swal.fire('Error', 'Failed to create menu.', 'error');
    }
  };

  return (
    <div className="max-w-3xl p-8 mx-auto bg-white rounded-md shadow-md">
      <h2 className="mb-6 text-2xl font-bold">Add New Menu</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Menu Name"
          value={menu_name}
          onChange={(e) => setMenuName(e.target.value)}
          className="w-full input input-bordered"
          required
        />

        {/* Parent Menu Dropdown */}
        <select
          className="w-full select select-bordered"
          value={parent}
          onChange={(e) => setParent(e.target.value)}
        >
          <option value="">No Parent (Top Level)</option>
          {parentMenus.map((menu) => (
            <option key={menu._id} value={menu._id}>
              {menu.menu_name}
            </option>
          ))}
        </select>

        {/* Page Type */}
        <select
          className="w-full select select-bordered"
          value={page_type}
          onChange={(e) => setPageType(e.target.value)}
        >
          <option value="">Select Page Type</option>
          <option value="page">Page</option>
          <option value="url">External URL</option>
        </select>

        {/* External Link */}
        <input
          type="text"
          placeholder="External Link (if any)"
          value={external_link}
          onChange={(e) => setExternalLink(e.target.value)}
          className="w-full input input-bordered"
        />

        {/* Target */}
        <select
          className="w-full select select-bordered"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        >
          <option value="">Open In</option>
          <option value="_self">Same Tab</option>
          <option value="_blank">New Tab</option>
        </select>

        {/* Sequence */}
        <input
          type="number"
          placeholder="Sequence (optional)"
          value={sequence}
          onChange={(e) => setSequence(e.target.value)}
          className="w-full input input-bordered"
        />

        {/* Checkboxes */}
        <div className="flex flex-wrap items-center gap-6">
          <label className="cursor-pointer label">
            <span className="mr-2 label-text">Display</span>
            <input type="checkbox" className="toggle" checked={display} onChange={() => setDisplay(!display)} />
          </label>
          <label className="cursor-pointer label">
            <span className="mr-2 label-text">Footer1</span>
            <input type="checkbox" className="toggle" checked={footer1} onChange={() => setFooter1(!footer1)} />
          </label>
          <label className="cursor-pointer label">
            <span className="mr-2 label-text">Footer2</span>
            <input type="checkbox" className="toggle" checked={footer2} onChange={() => setFooter2(!footer2)} />
          </label>
        </div>

        <button type="submit" className="w-full btn btn-primary">Save Menu</button>
      </form>
    </div>
  );
};

export default AddMenu;
