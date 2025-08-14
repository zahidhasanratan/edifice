import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    publishDate: '',
    shortDetails: '',
    featuredPhoto: '',
    coverPhoto: '',
    description: '',
  });

  const [newFeaturedFile, setNewFeaturedFile] = useState(null);
  const [newCoverFile, setNewCoverFile] = useState(null);

  // CKEditor refs
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const [editorReady, setEditorReady] = useState(false);

  // 1) Fetch existing news data
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`https://edifice-tau.vercel.app/api/news/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();
        setForm({
          ...data,
          publishDate: data.publishDate?.slice(0, 10) || '',
        });
        setEditorReady(true);
      } catch (err) {
        console.error('Error fetching news:', err);
        Swal.fire('Error!', 'Failed to fetch news data', 'error');
      }
    })();
  }, [id]);

  // 2) Load CKEditor 5 super-build (has Alignment + Justify) and init
  useEffect(() => {
    const initEditor = () => {
      if (!editorRef.current || editorInstanceRef.current || !editorReady) return;

      // super-build exposes global `CKEDITOR`
      window.CKEDITOR.ClassicEditor.create(editorRef.current, {
        toolbar: {
          items: [
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'link',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'alignment', // <— includes left/center/right/justify
            '|',
            'outdent',
            'indent',
            '|',
            'blockQuote',
            'insertTable',
            'undo',
            'redo'
          ],
          shouldNotGroupWhenFull: true
        },
        alignment: {
          options: ['left', 'center', 'right', 'justify']
        },

        // Optional: slim the super-build by removing heavy plugins you don't need
        removePlugins: [
          // Remove things you don't use to keep it lean
          'AIAssistant', 'CKBox', 'CKFinder', 'EasyImage', 'RealTimeCollaborativeComments',
          'RealTimeCollaborativeTrackChanges', 'RealTimeCollaborativeRevisionHistory',
          'PresenceList', 'Comments', 'TrackChanges', 'TrackChangesData', 'RevisionHistory',
          'Pagination', 'WProofreader', 'SlashCommand', 'Template', 'DocumentOutline',
          'FormatPainter', 'TableOfContents', 'PasteFromOfficeEnhanced', 'ExportPdf', 'ExportWord'
        ],
      })
        .then((editor) => {
          // Set initial content
          editor.setData(form.description || '');
          // Keep React state in sync
          editor.model.document.on('change:data', () => {
            setForm((prev) => ({ ...prev, description: editor.getData() }));
          });
          editorInstanceRef.current = editor;
        })
        .catch((error) => {
          console.error('CKEditor Error:', error);
          Swal.fire('Editor Error', 'Failed to initialize the editor', 'error');
        });
    };

    const loadEditorScript = () => {
      // Use SUPER-BUILD (note: different global than classic build)
      if (window.CKEDITOR?.ClassicEditor) {
        initEditor();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.ckeditor.com/ckeditor5/39.0.1/super-build/ckeditor.js';
      script.async = true;
      script.onload = initEditor;
      script.onerror = () => console.error('Failed to load CKEditor super-build');
      document.body.appendChild(script);
    };

    if (editorReady) loadEditorScript();

    // Cleanup on unmount
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().catch(() => {});
        editorInstanceRef.current = null;
      }
    };
  }, [editorReady]);

  // Sync external description changes back into editor if needed
  useEffect(() => {
    if (editorInstanceRef.current && typeof form.description === 'string') {
      const current = editorInstanceRef.current.getData();
      if (current !== form.description) {
        editorInstanceRef.current.setData(form.description);
      }
    }
  }, [form.description]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeaturedPhotoChange = (e) => {
    setNewFeaturedFile(e.target.files[0] || null);
  };

  const handleCoverPhotoChange = (e) => {
    setNewCoverFile(e.target.files[0] || null);
  };

  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!data?.success) {
      throw new Error('Image upload failed');
    }
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let featuredUrl = form.featuredPhoto;
      let coverUrl = form.coverPhoto;

      if (newFeaturedFile) {
        featuredUrl = await uploadImageToImgbb(newFeaturedFile);
      }
      if (newCoverFile) {
        coverUrl = await uploadImageToImgbb(newCoverFile);
      }

      const payload = {
        ...form,
        featuredPhoto: featuredUrl,
        coverPhoto: coverUrl,
      };

      const res = await fetch(`https://edifice-tau.vercel.app/api/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && (result._id || result.updatedAt)) {
        Swal.fire('Success!', 'News updated successfully!', 'success').then(() => {
          navigate('/news');
        });
      } else {
        throw new Error(result?.message || 'Update failed.');
      }
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire('Error!', error.message || 'Something went wrong', 'error');
    }
  };

  return (
    <div className="max-w-3xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Edit News Article</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="News Title"
          className="w-full input input-bordered"
          required
        />

        <input
          type="date"
          name="publishDate"
          value={form.publishDate}
          onChange={handleChange}
          className="w-full input input-bordered"
          required
        />

        <textarea
          name="shortDetails"
          value={form.shortDetails}
          onChange={handleChange}
          placeholder="Short Details"
          className="w-full textarea textarea-bordered"
          required
        />

        {/* Featured Photo */}
        {form.featuredPhoto ? (
          <div>
            <label className="block font-semibold">Current Featured Photo:</label>
            <img
              src={form.featuredPhoto}
              alt="Featured"
              className="object-cover w-40 h-24 mb-2 border rounded"
            />
          </div>
        ) : null}
        <input
          type="file"
          accept="image/*"
          onChange={handleFeaturedPhotoChange}
          className="w-full file-input file-input-bordered"
        />

        {/* Cover Photo */}
        {form.coverPhoto ? (
          <div>
            <label className="block font-semibold">Current Cover Photo:</label>
            <img
              src={form.coverPhoto}
              alt="Cover"
              className="object-cover w-40 h-24 mb-2 border rounded"
            />
          </div>
        ) : null}
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverPhotoChange}
          className="w-full file-input file-input-bordered"
        />

        {/* Description (CKEditor mounts here) */}
        <label className="font-medium">News Description</label>
        <div
          ref={editorRef}
          className="min-h-[220px] border rounded bg-white"
        />

        <button type="submit" className="w-full btn btn-primary">Update News</button>
      </form>
    </div>
  );
};

export default EditNews;
