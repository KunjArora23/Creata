import React, { useState, useRef, useEffect } from 'react';

function ChatWindow({ friend, messages, onSend }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

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

  function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  }

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
              {msg.content}
            </div>
          ))
        )}
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </main>

      {/* Input area */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-gray-800 bg-gray-850 flex gap-3 items-center"
        aria-label="Send message"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 rounded-2xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition"
          aria-label="Message input"
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
