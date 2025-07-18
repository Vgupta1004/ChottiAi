import React, { useState } from 'react';

export interface NoticeFormData {
  name: string;
  region: string;
  message: string;
  city: string;
  contact: string;
}

interface NoticeFormProps {
  onPost: (notice: NoticeFormData) => void;
  disabled?: boolean;
}

const NoticeForm: React.FC<NoticeFormProps> = ({ onPost, disabled = false }) => {
  const [form, setForm] = useState<NoticeFormData>({
    name: '',
    region: '',
    message: '',
    city: '',
    contact: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePost = () => {
    if (form.name && form.region && form.message && form.city && form.contact) {
      onPost(form);
      setForm({ name: '', region: '', message: '', city: '', contact: '' });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8 max-w-2xl mx-auto border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          className="rounded-lg border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          disabled={disabled}
        />
        <input
          className="rounded-lg border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          name="region"
          value={form.region}
          onChange={handleChange}
          placeholder="Region/State"
          disabled={disabled}
        />
      </div>
      <textarea
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400 transition mb-4"
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Message"
        rows={3}
        disabled={disabled}
        style={{ resize: 'none' }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          className="rounded-lg border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          disabled={disabled}
        />
        <input
          className="rounded-lg border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="Contact"
          disabled={disabled}
        />
      </div>
      <button
        className="rounded-lg bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed transition w-full"
        onClick={handlePost}
        disabled={disabled || !form.name || !form.region || !form.message || !form.city || !form.contact}
        type="button"
      >
        Post
      </button>
    </div>
  );
};

export default NoticeForm; 