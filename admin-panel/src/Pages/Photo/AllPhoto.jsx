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
    if (selectedAlbum) {
      setPage(1);
    }
  }, [selectedAlbum]);

  const fetchAlbums = async () => {
    const res = await fetch('http://localhost:5000/api/albums');
    const data = await res.json();
    setAlbums(data);
  };

  const fetchPhotos = async () => {
    const res = await fetch('http://localhost:5000/api/photos');
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
      const res = await fetch(`http://localhost:5000/api/photos/${id}`, {
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
    ? photos.filter((photo) => photo.album._id === selectedAlbum)
    : photos;

  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);
  const paginatedPhotos = filteredPhotos.slice(
    (page - 1) * photosPerPage,
    page * photosPerPage
  );

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">All Photos</h2>

      <div className="mb-4">
        <select
          className="w-full select select-bordered"
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

      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Album</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPhotos.map((photo) => (
              <tr key={photo._id}>
                <td>
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="object-cover w-24 h-16 rounded"
                  />
                </td>
                <td>{photo.title || 'Untitled'}</td>
                <td>{photo.album?.title || 'N/A'}</td>
                <td className="flex gap-2">
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
            ))}
            {paginatedPhotos.length === 0 && (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No photos found.
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
