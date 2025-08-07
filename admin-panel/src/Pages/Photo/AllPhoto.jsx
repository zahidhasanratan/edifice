import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export const AllPhoto = () => {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [page, setPage] = useState(1);
  const photosPerPage = 5;

  useEffect(() => {
    fetchAlbums();
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (selectedAlbum) setPage(1);
  }, [selectedAlbum]);

  const fetchAlbums = async () => {
    const res = await fetch('https://edifice-tau.vercel.app/api/albums');
    const data = await res.json();
    setAlbums(data);
  };

  const fetchPhotos = async () => {
    const res = await fetch('https://edifice-tau.vercel.app/api/photos');
    const data = await res.json();
    setPhotos(data);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete Photo?',
      text: 'Are you sure you want to delete this photo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      const res = await fetch(`https://edifice-tau.vercel.app/api/photos/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.deletedId) {
        Swal.fire('Deleted!', 'Photo deleted successfully.', 'success');
        fetchPhotos();
      } else {
        Swal.fire('Error!', 'Delete failed.', 'error');
      }
    }
  };

  const filteredPhotos = selectedAlbum
    ? photos.filter((photo) => photo.album?._id === selectedAlbum)
    : photos;

  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);
  const paginatedPhotos = filteredPhotos.slice(
    (page - 1) * photosPerPage,
    page * photosPerPage
  );

  return (
    <div className="max-w-6xl p-6 mx-auto">
      {/* 🔹 Header */}
      <div className="flex flex-col justify-between gap-4 mb-6 md:flex-row md:items-center">
        <h2 className="text-2xl font-bold">All Photos</h2>
        <Link to="/photos/add" className="btn btn-primary">+ Add Photo</Link>
      </div>

      {/* 🔍 Filter */}
      <div className="mb-4">
        <select
          className="w-full md:w-64 select select-bordered"
          value={selectedAlbum}
          onChange={(e) => setSelectedAlbum(e.target.value)}
        >
          <option value="">All Albums</option>
          {albums.map((album) => (
            <option key={album._id} value={album._id}>
              {album.title}
            </option>
          ))}
        </select>
      </div>

      {/* 📸 Photo Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table w-full table-zebra">
          <thead className="text-sm text-gray-700 bg-base-200">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Album</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPhotos.length > 0 ? (
              paginatedPhotos.map((photo) => (
                <tr key={photo._id}>
                  <td>
                    {photo.imageUrl ? (
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="object-cover w-24 h-16 rounded shadow"
                      />
                    ) : (
                      <span className="text-sm text-gray-400">No Image</span>
                    )}
                  </td>
                  <td>{photo.title || 'Untitled'}</td>
                  <td>{photo.album?.title || 'N/A'}</td>
                  <td className="flex justify-center gap-2">
                    <Link
                      to={`/photos/edit/${photo._id}`}
                      className="btn btn-xs btn-info"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(photo._id)}
                      className="btn btn-xs btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No photos found.
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
