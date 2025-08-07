import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import {
  FaTrash,
  FaCopy,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
  FaFileVideo,
} from 'react-icons/fa';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

export const MediaGallery = () => {
  const [media, setMedia] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch('https://edifice-tau.vercel.app/api/media');
      const data = await res.json();
      setMedia(data);
    } catch (err) {
      console.error('Error fetching media:', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);

      const res = await fetch('https://edifice-tau.vercel.app/api/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire('Uploaded!', '', 'success');
        fetchMedia();
        setFile(null);
        setTitle('');
        fileInputRef.current.value = '';
      } else {
        Swal.fire('Error', data.message || 'Upload failed', 'error');
      }
    } catch (err) {
      console.error('Upload error:', err);
      Swal.fire('Error', 'Upload failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete this file?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    });
    if (confirm.isConfirmed) {
      await fetch(`https://edifice-tau.vercel.app/api/media/${id}`, { method: 'DELETE' });
      fetchMedia();
    }
  };

  const handleCopy = (url, fileType) => {
    const finalUrl = getRawFileUrl(url, fileType);
    navigator.clipboard.writeText(finalUrl);
    Swal.fire('Link copied to clipboard');
  };

  const getRawFileUrl = (url, type) => {
    if (['pdf', 'doc', 'txt'].includes(type)) {
      return url
        .replace('/image/upload/', '/raw/upload/')
        .replace('/video/upload/', '/raw/upload/');
    }
    return url;
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'image':
        return <FaFileImage className="text-4xl text-blue-500" />;
      case 'pdf':
        return <FaFilePdf className="text-4xl text-red-500" />;
      case 'doc':
        return <FaFileWord className="text-4xl text-indigo-500" />;
      case 'video':
        return <FaFileVideo className="text-4xl text-green-500" />;
      default:
        return <div className="text-4xl text-gray-500">?</div>;
    }
  };

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Media Gallery</h2>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="grid gap-4 mb-6 md:grid-cols-3">
        <input
          type="text"
          placeholder="File Title (optional)"
          className="input input-bordered"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="file"
          ref={fileInputRef}
          className="file-input file-input-bordered"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {/* Media Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {media.map((item) => {
          const rawUrl = getRawFileUrl(item.fileUrl, item.fileType);

          return (
            <div key={item._id} className="p-3 border rounded shadow">
              <div className="flex justify-center h-20 mb-2">
                {item.fileType === 'image' ? (
                  <img
                    src={item.fileUrl}
                    alt={item.title}
                    className="object-cover h-full rounded"
                  />
                ) : (
                  renderIcon(item.fileType)
                )}
              </div>

              <p className="mb-1 text-sm truncate">{item.title || 'Untitled'}</p>

              <div className="flex justify-between mt-2">
                {item.fileType === 'pdf' ? (
                  <button
                    className="btn btn-xs btn-info"
                    onClick={() => setPreviewUrl(rawUrl)}
                  >
                    Preview
                  </button>
                ) : (
                  <a
                    href={rawUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-xs btn-outline"
                  >
                    Open
                  </a>
                )}

                <button
                  onClick={() => handleCopy(item.fileUrl, item.fileType)}
                  className="btn btn-xs btn-outline"
                >
                  <FaCopy />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="btn btn-xs btn-error"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PDF Preview Modal (with react-pdf) */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="w-[90%] max-w-4xl bg-white rounded p-4 relative">
            <button
              className="absolute text-xl text-red-600 top-2 right-2"
              onClick={() => setPreviewUrl(null)}
            >
              ✖
            </button>

            <div className="h-[600px] overflow-hidden">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer fileUrl={previewUrl} />
              </Worker>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
