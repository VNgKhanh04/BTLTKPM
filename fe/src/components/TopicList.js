// Component danh sách đề tài
// Thành viên 1: Màn hình danh sách đề tài và tìm kiếm

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { topicAPI, fieldAPI } from '../services/api';
import TopicCard from './TopicCard';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import Pagination from './Pagination';
import '../styles/TopicList.css';

const TopicList = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    keyword: '',
    fieldId: '',
    status: 'MO_DANG_KY',
    page: 1,
    limit: 10,
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Load danh sách lĩnh vực
  useEffect(() => {
    const loadFields = async () => {
      try {
        const data = await fieldAPI.getList();
        setFields(data);
      } catch (err) {
        console.error('Lỗi tải lĩnh vực:', err);
      }
    };
    loadFields();
  }, []);

  // Load danh sách đề tài
  useEffect(() => {
    const loadTopics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await topicAPI.getList(filters);
        setTopics(result.data);
        setPagination(result.pagination);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTopics();
  }, [filters]);

  const handleSearch = (keyword) => {
    setFilters(prev => ({ ...prev, keyword, page: 1 }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (loading && topics.length === 0) {
    return <div className="loading">Đang tải danh sách đề tài...</div>;
  }

  return (
    <div className="topic-list-container">
      <h1>Danh sách đề tài nghiên cứu</h1>

      <section className="registration-entry-panel">
        <div className="registration-entry-content">
          <h2>Không thấy đề tài phù hợp?</h2>
          <p>
            Bạn vẫn có thể đi tiếp trong cùng quy trình đăng ký bằng cách tạo nhóm và đề xuất một đề tài mới.
          </p>
        </div>
        <button
          type="button"
          className="btn-propose-topic"
          onClick={() => navigate('/register-topic/propose')}
        >
          Đề xuất đề tài mới
        </button>
      </section>
      
      <SearchBar 
        onSearch={handleSearch} 
        placeholder="Tìm kiếm theo tên hoặc mã đề tài..."
      />
      
      <FilterPanel 
        fields={fields}
        selectedFieldId={filters.fieldId}
        selectedStatus={filters.status}
        onFilterChange={handleFilterChange}
      />

      {error && <div className="error-message">{error}</div>}

      {topics.length === 0 ? (
        <div className="no-results">Không tìm thấy đề tài nào</div>
      ) : (
        <>
          <div className="topic-grid">
            {topics.map(topic => (
              <TopicCard key={topic.de_tai_id} topic={topic} />
            ))}
          </div>

          <Pagination 
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default TopicList;
