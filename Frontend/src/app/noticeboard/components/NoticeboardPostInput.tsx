import React, { useState } from 'react';

interface NoticeboardPostInputProps {
  onPost: (notice: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const NoticeboardPostInput: React.FC<NoticeboardPostInputProps> = ({
  onPost,
  placeholder = "Write a new notice...",
  disabled = false,
}) => {
  const [notice, setNotice] = useState('');

  const handlePost = () => {
    const trimmed = notice.trim();
    if (trimmed) {
      onPost(trimmed);
      setNotice('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
  };

  return (
    <div className="flex gap-2 items-end w-full">
      <textarea
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        rows={2}
        value={notice}
        onChange={e => setNotice(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        style={{ resize: 'none' }}
      />
      <button
        className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed transition"
        onClick={handlePost}
        disabled={disabled || !notice.trim()}
        type="button"
      >
        Post
      </button>
    </div>
  );
};

export default NoticeboardPostInput; 