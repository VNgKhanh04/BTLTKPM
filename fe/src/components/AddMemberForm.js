// Component form thêm thành viên
// Thành viên 2: Màn hình tạo nhóm đăng ký đề tài

import React, { useState } from 'react';
import { studentAPI } from '../services/api';
import '../styles/AddMemberForm.css';

const AddMemberForm = ({ onAdd }) => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!keyword.trim()) {
      setError('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }

    setSearching(true);
    setError(null);

    try {
      const results = await studentAPI.search(keyword);
      setSearchResults(results);
      
      if (results.length === 0) {
        setError('Không tìm thấy sinh viên nào');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const handleAddMember = async (studentId) => {
    setAdding(true);
    setError(null);

    try {
      await onAdd(studentId);
      
      // Clear search after adding
      setKeyword('');
      setSearchResults([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="add-member-form">
      <h3>Thêm thành viên mới</h3>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm theo tên hoặc mã sinh viên..."
          className="search-input"
        />
        <button type="submit" className="btn-search" disabled={searching}>
          {searching ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {searchResults.length > 0 && (
        <div className="search-results">
          <h4>Kết quả tìm kiếm ({searchResults.length})</h4>
          <div className="result-list">
            {searchResults.map((student) => (
              <div key={student.sinh_vien_id} className="result-item">
                <div className="student-info">
                  <h5>{student.ho_ten}</h5>
                  <p>MSSV: {student.ma_sinh_vien}</p>
                  {student.email && <p className="student-email">{student.email}</p>}
                  {student.Khoa && <p className="student-faculty">{student.Khoa.ten_khoa}</p>}
                </div>
                <button
                  className="btn-add"
                  onClick={() => handleAddMember(student.sinh_vien_id)}
                  disabled={adding}
                >
                  {adding ? 'Đang thêm...' : 'Thêm'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMemberForm;
