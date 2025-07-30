import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const AddProject = () => {
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
    specs: [
      { title: 'Orientation', value: 'South Facing' },
      { title: 'Structure', value: 'RCC Framed Structure' },
      { title: 'Flooring', value: 'Premium Marble' },
      { title: 'Parking', value: 'Basement & Ground' },
      { title: 'Lift', value: 'Modern Passenger Lift' },
      { title: 'Security', value: '24/7 Surveillance' },
    ],
    multiplePhotos: [],
    featureImage: null,
    innerBannerImage: null,
    mainImage: null
  });

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

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.data.url;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    console.log("Form submission started...");

    const featureImageUrl = form.featureImage ? await handleImageUpload(form.featureImage) : '';
    const innerBannerImageUrl = form.innerBannerImage ? await handleImageUpload(form.innerBannerImage) : '';
    const mainImageUrl = form.mainImage ? await handleImageUpload(form.mainImage) : '';

    const multiplePhotoUrls = [];
    for (const file of form.multiplePhotos) {
      const url = await handleImageUpload(file);
      multiplePhotoUrls.push(url);
    }

    const payload = {
      ...form,
      featureImage: featureImageUrl,
      innerBannerImage: innerBannerImageUrl,
      mainImage: mainImageUrl,
      multiplePhotos: multiplePhotoUrls,
    };

    console.log("Payload to submit:", payload);

    const res = await fetch('http://localhost:5000/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    console.log("Server response:", result);

    if (result._id || result.insertedId) {
      Swal.fire({ icon: 'success', title: 'Project Added Successfully' }).then(() => navigate('/projects'));
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Project insertion failed!' });
    }

  } catch (err) {
    console.error('Error submitting project:', err);
    Swal.fire({ icon: 'error', title: 'Catch Block Error', text: err.message });
  }
};


  const handleImageChange = (e, type) => {
    setForm({ ...form, [type]: e.target.files[0] });
  };

  const handleMultiplePhotosChange = (e) => {
    setForm({ ...form, multiplePhotos: Array.from(e.target.files) });
  };

  return (
    <div className="max-w-5xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Add Project</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input type="text" placeholder="Title" className="w-full input input-bordered" onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input type="text" placeholder="Subtitle" className="w-full input input-bordered" onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
        <input type="text" placeholder="Address" className="w-full input input-bordered" onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <input type="text" placeholder="Exact Location" className="w-full input input-bordered" onChange={(e) => setForm({ ...form, exactLocation: e.target.value })} />

        <select className="w-full select select-bordered" onChange={(e) => setForm({ ...form, projectType: e.target.value })}>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Upcoming">Upcoming</option>
        </select>

        <div className="col-span-2">
          <textarea placeholder="Overview" className="w-full textarea textarea-bordered" onChange={(e) => setForm({ ...form, overview: e.target.value })}></textarea>
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

        <div>
          <label className="block mb-1 font-semibold">Feature Image (450x280)</label>
          <input type="file" accept="image/*" className="w-full file-input file-input-bordered" onChange={(e) => handleImageChange(e, 'featureImage')} />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Inner Banner Image (420x1350)</label>
          <input type="file" accept="image/*" className="w-full file-input file-input-bordered" onChange={(e) => handleImageChange(e, 'innerBannerImage')} />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Main Image (550x1020)</label>
          <input type="file" accept="image/*" className="w-full file-input file-input-bordered" onChange={(e) => handleImageChange(e, 'mainImage')} />
        </div>

        <div className="col-span-2">
          <label className="block mb-1 font-semibold">Multiple Photos (228x400)</label>
          <input type="file" accept="image/*" multiple className="w-full file-input file-input-bordered" onChange={handleMultiplePhotosChange} />
        </div>

        <input type="text" placeholder="YouTube Video URL" className="w-full input input-bordered" onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} />
        <input type="text" placeholder="Google Map Location" className="w-full input input-bordered" onChange={(e) => setForm({ ...form, googleMapLocation: e.target.value })} />

        <div className="col-span-2 mt-4">
          <button type="submit" className="w-full btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
};
