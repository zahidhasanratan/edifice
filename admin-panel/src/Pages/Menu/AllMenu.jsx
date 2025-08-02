import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const AllMenu = () => {
  const [menus, setMenus] = useState([]);
  const [menuMap, setMenuMap] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchMenus = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/menus/all');
      const data = await res.json();

      setMenus(data);

      // Create ID → name map for parent lookup
      const flatMap = {};
      data.forEach((menu) => {
        flatMap[menu._id] = menu.menu_name;
        if (menu.children) {
          menu.children.forEach((child) => {
            flatMap[child._id] = child.menu_name;
          });
        }
      });
      setMenuMap(flatMap);

    } catch (err) {
      console.error('Error fetching menus:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the menu.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:5000/api/menus/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          Swal.fire('Deleted!', 'Menu deleted successfully.', 'success');
          fetchMenus();
        } else {
          Swal.fire('Error!', 'Failed to delete menu.', 'error');
        }
      } catch (error) {
        console.error('Delete error:', error);
        Swal.fire('Error!', 'Failed to delete menu.', 'error');
      }
    }
  };

  const renderRow = (menu, index, level = 0) => (
    <tr key={menu._id}>
      <td>{index}</td>
      <td>{Array(level).fill('— ').join('') + menu.menu_name}</td>
      <td>{menu.slug}</td>
      <td>{menu.parent ? menuMap[menu.parent] || '—' : '—'}</td>
      <td>{menu.page_type || '—'}</td>
      <td>{menu.target || '—'}</td>
      <td>{menu.display ? 'Yes' : 'No'}</td>
      <td>{menu.footer1 ? 'Yes' : 'No'}</td>
      <td>{menu.footer2 ? 'Yes' : 'No'}</td>
      <td>
        <div className="flex gap-2">
          <Link
            to={`/menu/edit/${menu._id}`}
            className="text-white btn btn-sm btn-info"
          >
            Edit
          </Link>
          <button
            className="text-white btn btn-sm btn-error"
            onClick={() => handleDelete(menu._id)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );

  const renderMenus = () => {
    let index = 1;
    const rows = [];

    menus.forEach((menu) => {
      rows.push(renderRow(menu, index++));
      if (menu.children && menu.children.length > 0) {
        menu.children.forEach((child) => {
          rows.push(renderRow(child, index++, 1));
        });
      }
    });

    return rows;
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <h2 className="mb-4 text-2xl font-semibold">All Menu Items</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>SL</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Parent</th>
                <th>Page Type</th>
                <th>Target</th>
                <th>Main</th>
                <th>Footer1</th>
                <th>Footer2</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{renderMenus()}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllMenu;
