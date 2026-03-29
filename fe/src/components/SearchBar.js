// Component thanh tìm kiếm
// Thành viên 1: Màn hình danh sách đề tài và tìm kiếm

import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch, placeholder = 'Tìm kiếm...' }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  const handleClear = () => {
    setKeyword('');
    onSearch('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      {keyword && (
        <button 
          type="button" 
          className="btn-clear" 
          onClick={handleClear}
        >
          ✕
        </button>
      )}
      <button type="submit" className="btn-search">
        Tìm kiếm
      </button>
    </form>
  );
};

export default SearchBar;
