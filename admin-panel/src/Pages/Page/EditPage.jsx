import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    subTitle: '',
    menuSlug: '',
    description: '',
    coverPhoto: '',
  });

  const [menus, setMenus] = useState([]);

  // CKEditor refs
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  useEffect(() => {
    fetchMenus();
    fetchPage();
    loadEditor();

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().catch(() => {});
        editorInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchMenus = async () => {
    try {
      const res = await fetch('https://edificese.vercel.app/api/menus/all', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch menus');
      const data = await res.json();
      setMenus(data);
    } catch (err) {
      console.error('Error fetching menus:', err);
    }
  };

  const fetchPage = async () => {
    try {
      const res = await fetch(`https://edificese.vercel.app/api/pages/${id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch page');
      const data = await res.json();
      setForm({
        title: data.title || '',
        subTitle: data.subTitle || '',
        menuSlug: data.menuSlug || '',
        description: data.description || '',
        coverPhoto: data.coverPhoto || '',
      });
    } catch (err) {
      console.error('Error fetching page:', err);
      Swal.fire('Error!', 'Failed to load page', 'error');
    }
  };

  // Load CKEditor 5 super-build (includes Alignment + Justify)
  const loadEditor = () => {
    const initEditor = () => {
      if (!editorRef.current || editorInstanceRef.current) return;

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
            'alignment', // left/center/right/justify
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
          // Sync editor -> React state
          editor.model.document.on('change:data', () => {
            setForm(prev => ({ ...prev, description: editor.getData() }));
          });

          // If we already have description (from fetchPage), push it into editor
          if (form.description) {
            editor.setData(form.description);
          }

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

  // Keep editor content in sync if form.description changes after editor is ready
  useEffect(() => {
    const editor = editorInstanceRef.current;
    if (editor && typeof form.description === 'string') {
      const current = editor.getData();
      if (current !== form.description) {
        editor.setData(form.description);
      }
    }
  }, [form.description]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImageToImgbb(file)
        .then((url) => setForm(prev => ({ ...prev, coverPhoto: url })))
        .catch((err) => {
          console.error('Upload error:', err);
          Swal.fire('Upload Error', err.message || 'Image upload failed', 'error');
        });
    }
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
      const payload = {
        title: form.title,
        subTitle: form.subTitle,
        menuSlug: form.menuSlug,
        description: form.description,
        coverPhoto: form.coverPhoto,
      };

      const res = await fetch(`https://edificese.vercel.app/api/pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire('Success!', 'Page updated successfully', 'success').then(() => {
          navigate('/pages');
        });
      } else {
        Swal.fire('Error!', result?.message || 'Update failed', 'error');
      }
    } catch (err) {
      console.error('Update error:', err);
      Swal.fire('Error!', err.message || 'Something went wrong', 'error');
    }
  };

  const buildMenuOptions = (menus, parentId = null, level = 0) => {
    let result = [];
    menus
      .filter((menu) => String(menu.parent) === String(parentId))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .forEach((menu) => {
        result.push({
          ...menu,
          displayName: `${'↳ '.repeat(level)}${menu.menu_name}`,
        });
        result = result.concat(buildMenuOptions(menus, menu._id, level + 1));
      });
    return result;
  };

  return (
    <div className="max-w-2xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Edit Page</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Page Title"
          className="w-full input input-bordered"
          required
        />

        <input
          type="text"
          name="subTitle"
          value={form.subTitle}
          onChange={handleChange}
          placeholder="Sub Title"
          className="w-full input input-bordered"
        />

        <select
          name="menuSlug"
          value={form.menuSlug}
          onChange={handleChange}
          className="w-full select select-bordered"
          required
        >
          <option value="">Select Menu</option>
          {buildMenuOptions(menus).map((menu) => (
            <option key={menu._id} value={menu.slug}>
              {menu.displayName}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full file-input file-input-bordered"
        />

        {form.coverPhoto && (
          <img
            src={form.coverPhoto}
            alt="Cover Preview"
            className="object-cover w-40 h-24 rounded"
          />
        )}

        <label className="font-medium">Description</label>
        <div
          ref={editorRef}
          className="min-h-[220px] border rounded bg-white"
        />

        <button type="submit" className="w-full btn btn-primary">
          Update Page
        </button>
      </form>
    </div>
  );
};
