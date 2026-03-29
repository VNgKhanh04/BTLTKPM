// Component chi tiết đề tài
// Thành viên 1: Màn hình danh sách đề tài và tìm kiếm

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { topicAPI } from '../services/api';
import '../styles/TopicDetail.css';

const TopicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTopicDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const [topicData, availabilityData] = await Promise.all([
          topicAPI.getById(id),
          topicAPI.checkAvailability(id),
        ]);

        setTopic(topicData);
        setAvailability(availabilityData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTopicDetail();
  }, [id]);

  const handleRegister = () => {
    // Chuyển sang màn hình tạo nhóm (Thành viên 2)
    navigate(`/register-topic/${id}`);
  };

  if (loading) {
    return <div className="loading">Đang tải thông tin đề tài...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!topic) {
    return <div className="error-message">Không tìm thấy đề tài</div>;
  }

  return (
    <div className="topic-detail-container">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="topic-detail-header">
        <h1>{topic.ten_de_tai}</h1>
        <span className={`status-badge status-${topic.trang_thai.toLowerCase()}`}>
          {topic.trang_thai}
        </span>
      </div>

      <div className="topic-detail-content">
        <section className="detail-section">
          <h2>Thông tin cơ bản</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Mã đề tài:</span>
              <span className="info-value">{topic.ma_de_tai}</span>
            </div>

            {topic.LinhVucNghienCuu && (
              <div className="info-item">
                <span className="info-label">Lĩnh vực:</span>
                <span className="info-value">{topic.LinhVucNghienCuu.ten_linh_vuc}</span>
              </div>
            )}

            {topic.GiangVien && (
              <div className="info-item">
                <span className="info-label">Giảng viên hướng dẫn:</span>
                <span className="info-value">{topic.GiangVien.ho_ten}</span>
              </div>
            )}

            <div className="info-item">
              <span className="info-label">Số lượng thành viên tối đa:</span>
              <span className="info-value">{topic.so_luong_thanh_vien_toi_da} người</span>
            </div>

            {topic.nam_hoc && (
              <div className="info-item">
                <span className="info-label">Năm học:</span>
                <span className="info-value">{topic.nam_hoc}</span>
              </div>
            )}

            {topic.hoc_ky && (
              <div className="info-item">
                <span className="info-label">Học kỳ:</span>
                <span className="info-value">{topic.hoc_ky}</span>
              </div>
            )}
          </div>
        </section>

        {topic.mo_ta && (
          <section className="detail-section">
            <h2>Mô tả</h2>
            <p className="description-text">{topic.mo_ta}</p>
          </section>
        )}

        {topic.muc_tieu && (
          <section className="detail-section">
            <h2>Mục tiêu</h2>
            <p className="description-text">{topic.muc_tieu}</p>
          </section>
        )}

        {topic.yeu_cau && (
          <section className="detail-section">
            <h2>Yêu cầu</h2>
            <p className="description-text">{topic.yeu_cau}</p>
          </section>
        )}

        {availability && (
          <section className="detail-section availability-section">
            <h2>Khả năng đăng ký</h2>
            {availability.available ? (
              <div className="availability-available">
                <p>✓ Đề tài này hiện đang mở đăng ký</p>
                <button className="btn-register" onClick={handleRegister}>
                  Đăng ký đề tài này
                </button>
              </div>
            ) : (
              <div className="availability-unavailable">
                <p>✗ {availability.reason}</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default TopicDetail;
