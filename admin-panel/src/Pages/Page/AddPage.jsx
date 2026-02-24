import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AddPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    subTitle: '',
    menuSlug: '',
    description: '',
    coverPhoto: null,
  });

  const [menus, setMenus] = useState([]);

  // CKEditor refs
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  useEffect(() => {
    fetchMenus();
    loadEditor();

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().catch(() => {});
        editorInstanceRef.current = null;
      }
    };
  }, []);

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

  // Use CKEditor 5 super-build so Alignment (incl. Justify) is available
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
        removePlugins: [
          // trim unused heavy plugins to keep editor light
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
            setForm((prev) => ({ ...prev, description: editor.getData() }));
          });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setForm((prev) => ({ ...prev, coverPhoto: e.target.files?.[0] || null }));
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
      let photoUrl = '';
      if (form.coverPhoto) {
        photoUrl = await uploadImageToImgbb(form.coverPhoto);
      }

      const payload = {
        title: form.title,
        subTitle: form.subTitle,
        menuSlug: form.menuSlug,
        description: form.description,
        coverPhoto: photoUrl,
      };

      const res = await fetch('https://edificese.vercel.app/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && (result._id || result.insertedId)) {
        Swal.fire('Success!', 'Page added successfully', 'success').then(() => {
          navigate('/pages');
        });
      } else {
        throw new Error(result?.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Submission error:', error);
      Swal.fire('Error!', error.message || 'Something went wrong', 'error');
    }
  };

  // ✅ Recursive function to build indented menu list
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
      <h2 className="mb-4 text-2xl font-bold">Add Page</h2>
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

        <label className="font-medium">Description</label>
        <div
          ref={editorRef}
          className="min-h-[220px] border rounded bg-white"
        />

        <button type="submit" className="w-full btn btn-primary">
          Add Page
        </button>
      </form>
    </div>
  );
};

export default AddPage;
