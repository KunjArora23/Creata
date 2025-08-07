import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search users by name or email..."
    className="w-full p-3 mb-4 rounded-lg bg-[#1F2937] text-white border border-[#30363D]"
  />
);

export default SearchBar;