// Component danh sách giảng viên hướng dẫn
// Thành viên 3: Màn hình chọn giảng viên hướng dẫn

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  groupAPI,
  lecturerAPI,
  getRegistrationTypeLabel,
  isProposalRegistration,
} from '../services/api';
import LecturerCard from './LecturerCard';
import '../styles/LecturerList.css';

function LecturerList() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    keyword: '',
    specialization: ''
  });
  const [group, setGroup] = useState(null);

  const fetchGroup = useCallback(async () => {
    try {
      const data = await groupAPI.getById(groupId);
      setGroup(data);
    } catch (err) {
      setError(err.message);
    }
  }, [groupId]);

  const fetchLecturers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await lecturerAPI.getList(filters);
      
      // Lấy thông tin quota cho từng giảng viên
      const lecturersWithQuota = await Promise.all(
        data.map(async (lecturer) => {
          try {
            const quotaData = await lecturerAPI.checkQuota(lecturer.giang_vien_id);
            return { ...lecturer, quota: quotaData };
          } catch (err) {
            return { ...lecturer, quota: null };
          }
        })
      );
      
      setLecturers(lecturersWithQuota);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchGroup();
    fetchLecturers();
  }, [fetchGroup, fetchLecturers]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLecturers();
  };

  const handleSelectLecturer = async (lecturerId) => {
    try {
      await lecturerAPI.assignToGroup(groupId, lecturerId);

      alert('Đã chọn giảng viên hướng dẫn thành công!');
      navigate(`/register-topic/review/${groupId}`);
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="lecturer-list-loading">Đang tải danh sách giảng viên...</div>;
  }

  if (error) {
    return <div className="lecturer-list-error">Lỗi: {error}</div>;
  }

  return (
    <div className="lecturer-list-container">
      <div className="lecturer-list-header">
        <h2>Chọn giảng viên hướng dẫn</h2>
        {group && (
          <div className="group-info">
            <p><strong>Nhóm:</strong> {group.ten_nhom}</p>
            <p><strong>Loại đăng ký:</strong> {getRegistrationTypeLabel(group)}</p>
            <p>
              <strong>Đề tài:</strong>{' '}
              {isProposalRegistration(group)
                ? 'Đề xuất mới - sẽ hoàn thiện ở bước rà soát hồ sơ'
                : group.DeTaiNghienCuu?.ten_de_tai || 'Chưa cập nhật'}
            </p>
          </div>
        )}
      </div>

      <div className="lecturer-search-section">
        <form onSubmit={handleSearch} className="lecturer-search-form">
          <input
            type="text"
            placeholder="Tìm theo tên, mã giảng viên, email..."
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            className="lecturer-search-input"
          />
          <input
            type="text"
            placeholder="Lọc theo chuyên môn..."
            value={filters.specialization}
            onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
            className="lecturer-search-input"
          />
          <button type="submit" className="lecturer-search-button">
            Tìm kiếm
          </button>
        </form>
      </div>

      <div className="lecturer-list-content">
        {lecturers.length === 0 ? (
          <div className="no-lecturers">
            <p>Không tìm thấy giảng viên nào</p>
          </div>
        ) : (
          <div className="lecturer-grid">
            {lecturers.map((lecturer) => (
              <LecturerCard
                key={lecturer.giang_vien_id}
                lecturer={lecturer}
                onSelect={handleSelectLecturer}
              />
            ))}
          </div>
        )}
      </div>

      <div className="lecturer-list-actions">
        <button 
          onClick={() => navigate(-1)} 
          className="btn-back"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}

export default LecturerList;
