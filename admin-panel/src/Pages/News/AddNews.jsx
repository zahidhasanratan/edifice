import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AddNews = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    publishDate: '',
    shortDetails: '',
    featuredPhoto: null,
    coverPhoto: null,
    description: '',
  });

  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  // Load CKEditor 5 super-build (has Alignment + Justify) and init
  useEffect(() => {
    const initEditor = () => {
      if (!editorRef.current || editorInstanceRef.current) return;

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
            'alignment', // includes left/center/right/justify
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
        // trim bloat you don't use
        removePlugins: [
          'AIAssistant', 'CKBox', 'CKFinder', 'EasyImage',
          'RealTimeCollaborativeComments', 'RealTimeCollaborativeTrackChanges',
          'RealTimeCollaborativeRevisionHistory', 'PresenceList', 'Comments',
          'TrackChanges', 'TrackChangesData', 'RevisionHistory',
          'Pagination', 'WProofreader', 'SlashCommand', 'Template',
          'DocumentOutline', 'FormatPainter', 'TableOfContents',
          'PasteFromOfficeEnhanced', 'ExportPdf', 'ExportWord'
        ],
      })
        .then((editor) => {
          editor.model.document.on('change:data', () => {
            setForm(prev => ({ ...prev, description: editor.getData() }));
          });
          editorInstanceRef.current = editor;
        })
        .catch((error) => {
          console.error('CKEditor Error:', error);
          Swal.fire('Editor Error', 'Failed to initialize the editor', 'error');
        });
    };

    const loadEditorScript = () => {
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

    loadEditorScript();

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().catch(() => {});
        editorInstanceRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const { name, files } = e.target;
    setForm(prev => ({ ...prev, [name]: files?.[0] || null }));
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
      throw new Error(data?.error?.message || 'Image upload failed');
    }
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let featuredPhotoUrl = '';
      let coverPhotoUrl = '';

      if (form.featuredPhoto) {
        featuredPhotoUrl = await uploadImageToImgbb(form.featuredPhoto);
      }
      if (form.coverPhoto) {
        coverPhotoUrl = await uploadImageToImgbb(form.coverPhoto);
      }

      const payload = {
        title: form.title,
        publishDate: form.publishDate,
        shortDetails: form.shortDetails,
        featuredPhoto: featuredPhotoUrl,
        coverPhoto: coverPhotoUrl,
        description: form.description,
      };

      const res = await fetch('https://edificese.vercel.app/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && (result._id || result.insertedId)) {
        Swal.fire('Success!', 'News article added successfully', 'success').then(() => {
          navigate('/news');
        });
      } else {
        throw new Error(result?.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Submission error:', error);
      Swal.fire('Error!', error.message || 'Something went wrong', 'error');
    }
  };

  return (
    <div className="max-w-2xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Add News Article</h2>
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
        <div>
          <label className="block mb-1 font-medium">Featured Photo</label>
          <input
            type="file"
            accept="image/*"
            name="featuredPhoto"
            onChange={handlePhotoChange}
            className="w-full file-input file-input-bordered"
          />
        </div>

        {/* Cover Photo */}
        <div>
          <label className="block mb-1 font-medium">Cover Photo</label>
          <input
            type="file"
            accept="image/*"
            name="coverPhoto"
            onChange={handlePhotoChange}
            className="w-full file-input file-input-bordered"
          />
        </div>

        <label className="font-medium">News Description</label>
        <div
          ref={editorRef}
          className="min-h-[220px] border rounded bg-white"
        />

        <button type="submit" className="w-full btn btn-primary">
          Add News
        </button>
      </form>
    </div>
  );
};

export default AddNews;
