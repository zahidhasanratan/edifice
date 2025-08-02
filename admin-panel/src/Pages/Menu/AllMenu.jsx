import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const AllMenu = () => {
  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [menuMap, setMenuMap] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    filterMenus();
  }, [menus, searchTerm]);

  const fetchMenus = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/menus/all');
      const data = await res.json();
      setMenus(data);
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

  const filterMenus = () => {
    const filtered = [];
    menus.forEach((menu) => {
      if (
        menu.menu_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        menu.slug.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        filtered.push({ ...menu, level: 0 });
      }
      if (menu.children) {
        menu.children.forEach((child) => {
          if (
            child.menu_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            child.slug.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            filtered.push({ ...child, level: 1 });
          }
        });
      }
    });
    setFilteredMenus(filtered);
    setCurrentPage(1);
  };

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredMenus.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* Title and Search */}
      <div className="flex flex-col justify-between gap-4 mb-6 md:flex-row md:items-center">
        <h2 className="text-2xl font-semibold">All Menu Items</h2>
        <div className="flex flex-col items-end gap-2 md:flex-row">
          <input
            type="text"
            placeholder="Search by name or slug..."
            className="input input-bordered"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/menu/add" className="btn btn-primary">
            + Add Menu
          </Link>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="table w-full">
              <thead className="text-sm text-gray-700 bg-gray-100">
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
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((menu, index) => (
                    <tr key={menu._id}>
                      <td>{startIndex + index + 1}</td>
                      <td>{Array(menu.level).fill('— ').join('') + menu.menu_name}</td>
                      <td>{menu.slug}</td>
                      <td>{menu.parent ? menuMap[menu.parent] || '—' : '—'}</td>
                      <td>{menu.page_type || '—'}</td>
                      <td>{menu.target || '—'}</td>
                      <td>{menu.display ? 'Yes' : 'No'}</td>
                      <td>{menu.footer1 ? 'Yes' : 'No'}</td>
                      <td>{menu.footer2 ? 'Yes' : 'No'}</td>
                      <td>
                        <div className="flex gap-2">
                          <Link to={`/menu/edit/${menu._id}`} className="text-white btn btn-sm btn-info">
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="py-4 text-center text-gray-400">
                      No menu items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="btn btn-sm"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="btn btn-sm"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllMenu;
