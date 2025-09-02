import React, { useState, useRef, useEffect } from 'react';
import { Image, Send, X } from 'lucide-react';

function ChatWindow({ friend, messages, onSend }) {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const messagesContainer = messagesEndRef.current?.parentElement;

    if (messagesContainer) {
      const isNearBottom =
        messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight < 100;

      if (isNearBottom) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    setIsUploading(true);
    try {
      if (selectedImage) {
        // Handle image upload
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('receiverId', friend._id);

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messages/upload-image`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const result = await response.json();
        if (result.success) {
          // Don't call onSend for images as they're already created on the server
          // The socket will handle the real-time update automatically
          console.log('Image uploaded successfully');
        }
      } else {
        // Handle text message
        onSend(input.trim());
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // You might want to show a toast notification here
    } finally {
      setInput('');
      setSelectedImage(null);
      setImagePreview(null);
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!friend) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center text-gray-500 select-none">
        No friend selected.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-2xl mx-auto bg-gray-900 rounded-2xl shadow-xl ring-1 ring-black ring-opacity-10">
      {/* Header */}
      <header className="flex items-center gap-4 p-5 border-b border-gray-800 bg-gray-850">
        <div className="relative flex-shrink-0">
          {friend.avatarUrl ? (
            <img
              src={friend.avatarUrl}
              alt={friend.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-xl uppercase border-2 border-indigo-500">
              {friend.name?.charAt(0)}
            </div>
          )}
          {/* Online status indicator */}
          <span
            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-gray-900 ${
              friend.status === 'Online' ? 'bg-green-400' : 'bg-gray-600'
            }`}
            title={friend.status || 'Offline'}
          />
        </div>
        <div>
          <h2 className="text-white font-semibold text-lg leading-tight">{friend.name}</h2>
          <p className="text-gray-400 text-sm">{friend.status || 'Offline'}</p>
        </div>
      </header>

      {/* Messages container */}
      <main
        className="flex-1 overflow-y-auto p-6 space-y-3 bg-gradient-to-b from-gray-900 via-gray-850 to-gray-900 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800"
        aria-label={`Chat history with ${friend.name}`}
      >
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 italic select-none mt-12">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={msg._id || idx}
              className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed break-words shadow-md ${
                msg.isOwn
                  ? 'bg-indigo-600 text-white ml-auto rounded-br-none'
                  : 'bg-gray-700 text-gray-100 mr-auto rounded-bl-none'
              }`}
              role="article"
              aria-label={msg.isOwn ? 'Your message' : `${friend.name}'s message`}
              tabIndex={0}
            >
              {msg.messageType === 'image' && msg.imageUrl ? (
                <div className="space-y-2">
                  <img
                    src={msg.imageUrl}
                    alt="Shared image"
                    className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(msg.imageUrl, '_blank')}
                  />
                  {msg.content && <p className="text-sm">{msg.content}</p>}
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          ))
        )}
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </main>

      {/* Image preview */}
      {imagePreview && (
        <div className="p-4 border-t border-gray-800 bg-gray-850">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-32 rounded-lg"
            />
            <button
              onClick={removeSelectedImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-gray-800 bg-gray-850 flex gap-3 items-center"
        aria-label="Send message"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-2xl bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          aria-label="Attach image"
        >
          <Image size={20} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 rounded-2xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition"
          aria-label="Message input"
          autoComplete="off"
          spellCheck="false"
          disabled={isUploading}
        />
        <button
          type="submit"
          disabled={(!input.trim() && !selectedImage) || isUploading}
          className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
