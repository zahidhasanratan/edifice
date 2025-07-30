import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa';

export const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    address: '',
    exactLocation: '',
    overview: '',
    youtubeUrl: '',
    googleMapLocation: '',
    projectType: 'Ongoing',
    specs: [],
    multiplePhotos: [],
    featureImage: '',
    innerBannerImage: '',
    mainImage: ''
  });

  useEffect(() => {
    const fetchProject = async () => {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`);
      const data = await res.json();
      setForm(data);
    };
    fetchProject();
  }, [id]);

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...form.specs];
    newSpecs[index][field] = value;
    setForm({ ...form, specs: newSpecs });
  };

  const addSpecField = () => {
    setForm({ ...form, specs: [...form.specs, { title: '', value: '' }] });
  };

  const removeSpecField = (index) => {
    const newSpecs = form.specs.filter((_, i) => i !== index);
    setForm({ ...form, specs: newSpecs });
  };

  const handleImageChange = (e, type) => {
    setForm({ ...form, [type]: e.target.files[0] });
  };

  const handleMultiplePhotosChange = (e) => {
    setForm({ ...form, multiplePhotos: Array.from(e.target.files) });
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const featureImageUrl = form.featureImage instanceof File ? await handleImageUpload(form.featureImage) : form.featureImage;
      const innerBannerImageUrl = form.innerBannerImage instanceof File ? await handleImageUpload(form.innerBannerImage) : form.innerBannerImage;
      const mainImageUrl = form.mainImage instanceof File ? await handleImageUpload(form.mainImage) : form.mainImage;

      const multiplePhotoUrls = [];
      if (form.multiplePhotos.length > 0 && form.multiplePhotos[0] instanceof File) {
        for (const file of form.multiplePhotos) {
          const url = await handleImageUpload(file);
          multiplePhotoUrls.push(url);
        }
      } else {
        multiplePhotoUrls.push(...form.multiplePhotos);
      }

      const payload = {
        ...form,
        featureImage: featureImageUrl,
        innerBannerImage: innerBannerImageUrl,
        mainImage: mainImageUrl,
        multiplePhotos: multiplePhotoUrls
      };

      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Project Updated Successfully' }).then(() => navigate('/projects'));
      } else {
        Swal.fire({ icon: 'error', title: 'Update Failed', text: result.message });
      }
    } catch (err) {
      console.error('Update Error:', err);
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  return (
    <div className="max-w-5xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Edit Project</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input type="text" value={form.title} placeholder="Title" className="w-full input input-bordered" onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input type="text" value={form.subtitle} placeholder="Subtitle" className="w-full input input-bordered" onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
        <input type="text" value={form.address} placeholder="Address" className="w-full input input-bordered" onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <input type="text" value={form.exactLocation} placeholder="Exact Location" className="w-full input input-bordered" onChange={(e) => setForm({ ...form, exactLocation: e.target.value })} />

        <select className="w-full select select-bordered" value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })}>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Upcoming">Upcoming</option>
        </select>

        <div className="col-span-2">
          <textarea value={form.overview} placeholder="Overview" className="w-full textarea textarea-bordered" onChange={(e) => setForm({ ...form, overview: e.target.value })}></textarea>
        </div>

        <div className="col-span-2">
          <h4 className="mb-2 font-semibold">Project Specifications</h4>
          {form.specs.map((spec, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input type="text" placeholder="Title" className="w-full input input-bordered" value={spec.title} onChange={(e) => handleSpecChange(index, 'title', e.target.value)} />
              <input type="text" placeholder="Value" className="w-full input input-bordered" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} />
              <button type="button" onClick={() => removeSpecField(index)} className="btn btn-error btn-sm"><FaTrash /></button>
            </div>
          ))}
          <button type="button" className="mt-2 btn btn-sm btn-accent" onClick={addSpecField}>+ Add More</button>
        </div>

        {['featureImage', 'innerBannerImage', 'mainImage'].map((key) => (
          <div key={key}>
            <label className="block mb-1 font-semibold">{key.replace(/([A-Z])/g, ' $1')}</label>
            {typeof form[key] === 'string' && form[key] && (
              <img src={form[key]} alt={key} className="w-32 mb-2 rounded" />
            )}
            <input type="file" accept="image/*" className="w-full file-input file-input-bordered" onChange={(e) => handleImageChange(e, key)} />
          </div>
        ))}

        <div className="col-span-2">
          <label className="block mb-1 font-semibold">Multiple Photos</label>
          {Array.isArray(form.multiplePhotos) && form.multiplePhotos.length > 0 && typeof form.multiplePhotos[0] === 'string' && (
            <div className="flex gap-2 mb-2">
              {form.multiplePhotos.slice(0, 3).map((url, idx) => (
                <img key={idx} src={url} alt={`Photo ${idx}`} className="w-20 h-16 rounded" />
              ))}
            </div>
          )}
          <input type="file" accept="image/*" multiple className="w-full file-input file-input-bordered" onChange={handleMultiplePhotosChange} />
        </div>

        <input type="text" value={form.youtubeUrl} placeholder="YouTube Video URL" className="w-full input input-bordered" onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} />
        <input type="text" value={form.googleMapLocation} placeholder="Google Map Location" className="w-full input input-bordered" onChange={(e) => setForm({ ...form, googleMapLocation: e.target.value })} />

        <div className="col-span-2 mt-4">
          <button type="submit" className="w-full btn btn-primary">Update</button>
        </div>
      </form>
    </div>
  );
};
