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
      const res = await fetch('http://localhost:5000/api/albums');
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
    setPage(1); // Reset to first page on new search
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
        const res = await fetch(`http://localhost:5000/api/albums/${id}`, {
          method: 'DELETE',
        });
        const result = await res.json();

        if (result.deletedId) {
          Swal.fire('Deleted!', 'Album has been deleted.', 'success');
          fetchAlbums(); // Refresh list
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
      <h2 className="mb-4 text-2xl font-bold">All Photo Albums</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full input input-bordered"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
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
                    <img
                      src={album.coverPhoto}
                      alt={album.title}
                      className="object-cover w-24 h-16 rounded"
                    />
                  </td>
                  <td>{album.title}</td>
                  <td className="flex items-center justify-center gap-2">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
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
                page === num + 1 ? 'btn-primary' : 'btn-ghost'
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
