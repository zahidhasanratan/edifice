import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [menuData, setMenuData] = useState({
    menu_name: '',
    parent: '',
    page_type: '',
    external_link: '',
    target: '',
    display: false,
    footer1: false,
    footer2: false,
    sequence: '',
  });

  const [parentMenus, setParentMenus] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const res = await fetch(`http://localhost:5000/api/menus/${id}`);
      const data = await res.json();
      setMenuData({
        menu_name: data.menu_name || '',
        parent: data.parent || '',
        page_type: data.page_type || '',
        external_link: data.external_link || '',
        target: data.target || '',
        display: data.display || false,
        footer1: data.footer1 || false,
        footer2: data.footer2 || false,
        sequence: data.sequence || '',
      });
    };

    const fetchParentMenus = async () => {
      const res = await fetch('http://localhost:5000/api/menus/all');
      const data = await res.json();
      const onlyParents = data.filter(menu => !menu.parent || menu.parent === null);
      setParentMenus(onlyParents.filter(menu => menu._id !== id)); // exclude self
    };

    fetchMenu();
    fetchParentMenus();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/api/menus/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData),
      });

      if (res.ok) {
        Swal.fire('Success', 'Menu updated successfully!', 'success');
        navigate('/menu'); // ✅ correct redirect
      } else {
        Swal.fire('Error', 'Failed to update menu', 'error');
      }
    } catch (err) {
      console.error('Update error:', err);
      Swal.fire('Error', 'An error occurred', 'error');
    }
  };

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-semibold">Edit Menu</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="menu_name"
          value={menuData.menu_name}
          onChange={handleChange}
          placeholder="Menu Name"
          className="w-full input input-bordered"
          required
        />

        <select
          name="parent"
          value={menuData.parent}
          onChange={handleChange}
          className="w-full select select-bordered"
        >
          <option value="">-- No Parent --</option>
          {parentMenus.map((menu) => (
            <option key={menu._id} value={menu._id}>
              {menu.menu_name}
            </option>
          ))}
        </select>

        <div className="flex gap-4">
          <select
            name="page_type"
            value={menuData.page_type}
            onChange={handleChange}
            className="w-full select select-bordered"
          >
            <option value="">-- Select Page Type --</option>
            <option value="page">Page</option>
            <option value="url">External URL</option>
          </select>

          <select
            name="target"
            value={menuData.target}
            onChange={handleChange}
            className="w-full select select-bordered"
          >
            <option value="">-- Target --</option>
            <option value="_self">Self</option>
            <option value="_blank">New Tab</option>
          </select>
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            name="external_link"
            value={menuData.external_link}
            onChange={handleChange}
            placeholder="External Link"
            className="w-full input input-bordered"
          />

          <input
            type="number"
            name="sequence"
            value={menuData.sequence}
            onChange={handleChange}
            placeholder="Sequence"
            className="w-full input input-bordered"
          />
        </div>

        <div className="flex gap-6">
          <label className="gap-2 cursor-pointer label">
            <span className="label-text">Display</span>
            <input
              type="checkbox"
              name="display"
              checked={menuData.display}
              onChange={handleChange}
              className="checkbox"
            />
          </label>

          <label className="gap-2 cursor-pointer label">
            <span className="label-text">Footer1</span>
            <input
              type="checkbox"
              name="footer1"
              checked={menuData.footer1}
              onChange={handleChange}
              className="checkbox"
            />
          </label>

          <label className="gap-2 cursor-pointer label">
            <span className="label-text">Footer2</span>
            <input
              type="checkbox"
              name="footer2"
              checked={menuData.footer2}
              onChange={handleChange}
              className="checkbox"
            />
          </label>
        </div>

        <button type="submit" className="w-full btn btn-primary">
          Update Menu
        </button>
      </form>
    </div>
  );
};

export default EditMenu;
