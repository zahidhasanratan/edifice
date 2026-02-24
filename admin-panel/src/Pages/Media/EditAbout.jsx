import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';

const EditAbout = () => {
  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    featurePhoto: '',
    coverPhoto: '',
    tag1: '',
    tag2: '',
  });

  const [featureFile, setFeatureFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  // CKEditor refs
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  useEffect(() => {
    fetchAbout();
    loadEditor();

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().catch(() => {});
        editorInstanceRef.current = null;
      }
    };
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await fetch('https://edificese.vercel.app/api/about', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load About');
      const data = await res.json();
      if (data) {
        setForm({
          title: data.title || '',
          shortDescription: data.shortDescription || '',
          description: data.description || '',
          featurePhoto: data.featurePhoto || '',
          coverPhoto: data.coverPhoto || '',
          tag1: data.tag1 || '',
          tag2: data.tag2 || '',
        });
      }
    } catch (err) {
      console.error('Failed to load About:', err);
      Swal.fire('Error', 'Failed to load About data', 'error');
    }
  };

  // Load CKEditor 5 super-build (includes Alignment + Justify)
  const loadEditor = () => {
    const initEditor = () => {
      if (!editorRef.current || editorInstanceRef.current) return;

      // super-build exposes global CKEDITOR
      window.CKEDITOR.ClassicEditor.create(editorRef.current, {
        toolbar: {
          items: [
            'heading',
            '|',
            'bold', 'italic', 'underline', 'strikethrough', 'link',
            '|',
            'bulletedList', 'numberedList',
            '|',
            'alignment', // left/center/right/justify
            '|',
            'outdent', 'indent',
            '|',
            'blockQuote', 'insertTable',
            'undo', 'redo'
          ],
          shouldNotGroupWhenFull: true
        },
        alignment: {
          options: ['left', 'center', 'right', 'justify']
        },
        removePlugins: [
          // Trim heavy/unused plugins
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
          // React ← editor
          editor.model.document.on('change:data', () => {
            setForm((prev) => ({ ...prev, description: editor.getData() }));
          });

          // Push current description if already loaded
          if (form.description) editor.setData(form.description);

          editorInstanceRef.current = editor;
        })
        .catch((error) => {
          console.error('CKEditor Error:', error);
          Swal.fire('Editor Error', 'Failed to initialize the editor', 'error');
        });
    };

    if (window.CKEDITOR?.ClassicEditor) {
      initEditor();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.ckeditor.com/ckeditor5/39.0.1/super-build/ckeditor.js';
      script.async = true;
      script.onload = initEditor;
      script.onerror = () => console.error('Failed to load CKEditor super-build');
      document.body.appendChild(script);
    }
  };

  // Keep editor in sync when description updates after fetch
  useEffect(() => {
    const editor = editorInstanceRef.current;
    if (editor && typeof form.description === 'string') {
      const current = editor.getData();
      if (current !== form.description) editor.setData(form.description);
    }
  }, [form.description]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImageToImgbb = async (file) => {
    if (!file) return '';
    const imgbbKey = import.meta.env.VITE_IMGBB_KEY;
    if (!imgbbKey) throw new Error('Missing VITE_IMGBB_KEY in frontend env.');

    const fd = new FormData();
    fd.append('image', file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: 'POST',
      body: fd,
    });
    const data = await res.json();
    if (!data?.success) throw new Error(data?.error?.message || 'Image upload failed');
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let featurePhotoUrl = form.featurePhoto || '';
      let coverPhotoUrl = form.coverPhoto || '';

      if (featureFile) featurePhotoUrl = await uploadImageToImgbb(featureFile);
      if (coverFile) coverPhotoUrl = await uploadImageToImgbb(coverFile);

      const payload = {
        title: form.title,
        shortDescription: form.shortDescription,
        description: form.description,
        featurePhoto: featurePhotoUrl,
        coverPhoto: coverPhotoUrl,
        tag1: form.tag1,
        tag2: form.tag2,
      };

      const res = await fetch('https://edificese.vercel.app/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire('Updated!', 'About section updated successfully', 'success');
      } else {
        throw new Error(result?.message || 'Update failed');
      }
    } catch (err) {
      console.error('Submit error:', err);
      Swal.fire('Error', err.message || 'Something went wrong', 'error');
    }
  };

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Edit About</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full input input-bordered"
          placeholder="About Title"
          required
        />

        <textarea
          name="shortDescription"
          value={form.shortDescription}
          onChange={handleChange}
          className="w-full textarea textarea-bordered"
          placeholder="Short Description"
          required
        />

        <input
          type="text"
          name="tag1"
          value={form.tag1}
          onChange={handleChange}
          className="w-full input input-bordered"
          placeholder="Tag 1"
        />

        <input
          type="text"
          name="tag2"
          value={form.tag2}
          onChange={handleChange}
          className="w-full input input-bordered"
          placeholder="Tag 2"
        />

        <div>
          <label className="font-medium">Feature Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFeatureFile(e.target.files?.[0] || null)}
            className="w-full file-input file-input-bordered"
          />
          {form.featurePhoto && (
            <img
              src={form.featurePhoto}
              alt="Feature"
              className="object-cover w-32 h-20 mt-2 rounded"
            />
          )}
        </div>

        <div>
          <label className="font-medium">Cover Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            className="w-full file-input file-input-bordered"
          />
          {form.coverPhoto && (
            <img
              src={form.coverPhoto}
              alt="Cover"
              className="object-cover w-32 h-20 mt-2 rounded"
            />
          )}
        </div>

        <label className="font-medium">Description</label>
        <div
          ref={editorRef}
          className="min-h-[220px] border rounded bg-white"
        />

        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditAbout;
