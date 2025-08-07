import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export const AllAlbum = () => {
  const [albums, setAlbums] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [page, setPage] = useState(1);
  const albumsPerPage = 5;

  useEffect(() => {
    fetchAlbums();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search, albums]);

  const fetchAlbums = async () => {
    try {
      const res = await fetch('https://edifice-tau.vercel.app/api/albums');
      const data = await res.json();
      setAlbums(data);
    } catch (err) {
      console.error('Error fetching albums:', err);
    }
  };

  const handleSearch = () => {
    const result = albums.filter(album =>
      album.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAlbums(result);
    setPage(1);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete Album?',
      text: 'Are you sure you want to delete this album?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://edifice-tau.vercel.app/api/albums/${id}`, {
          method: 'DELETE',
        });
        const result = await res.json();

        if (result.deletedId) {
          Swal.fire('Deleted!', 'Album has been deleted.', 'success');
          fetchAlbums();
        } else {
          Swal.fire('Error!', 'Failed to delete album.', 'error');
        }
      } catch (err) {
        Swal.fire('Error!', err.message, 'error');
      }
    }
  };

  const startIdx = (page - 1) * albumsPerPage;
  const paginatedAlbums = filteredAlbums.slice(startIdx, startIdx + albumsPerPage);
  const totalPages = Math.ceil(filteredAlbums.length / albumsPerPage);

  return (
    <div className="max-w-6xl p-6 mx-auto">
      {/* 🔹 Header Section */}
      <div className="flex flex-col justify-between gap-4 mb-6 md:flex-row md:items-center">
        <h2 className="text-2xl font-bold">All Photo Albums</h2>
        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
          <input
            type="text"
            placeholder="Search by title..."
            className="w-full input input-bordered md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link to="/album/add" className="btn btn-primary">+ Add Album</Link>
        </div>
      </div>

      {/* 📸 Album Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table w-full table-zebra">
          <thead className="text-sm text-gray-700 bg-base-200">
            <tr>
              <th>Cover Photo</th>
              <th>Title</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAlbums.length > 0 ? (
              paginatedAlbums.map((album) => (
                <tr key={album._id}>
                  <td>
                    {album.coverPhoto ? (
                      <img
                        src={album.coverPhoto}
                        alt={album.title}
                        className="object-cover w-24 h-16 rounded shadow"
                      />
                    ) : (
                      <span className="text-sm text-gray-400">No Image</span>
                    )}
                  </td>
                  <td>{album.title}</td>
                  <td className="flex justify-center gap-2">
                    <Link
                      to={`/albums/edit/${album._id}`}
                      className="btn btn-xs btn-info"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(album._id)}
                      className="btn btn-xs btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 text-center text-gray-500">
                  No albums found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔄 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            className="btn btn-sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              onClick={() => setPage(num + 1)}
              className={`btn btn-sm ${
                page === num + 1 ? 'btn-primary' : 'btn-outline'
              }`}
            >
              {num + 1}
            </button>
          ))}
          <button
            className="btn btn-sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
