// Component card hiển thị thông tin đề tài
// Thành viên 1: Màn hình danh sách đề tài và tìm kiếm

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TopicCard.css';

const TopicCard = ({ topic }) => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/topics/${topic.de_tai_id}`);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'MO_DANG_KY': { text: 'Mở đăng ký', className: 'status-open' },
      'DANG_THUC_HIEN': { text: 'Đang thực hiện', className: 'status-in-progress' },
      'HOAN_THANH': { text: 'Hoàn thành', className: 'status-completed' },
      'DONG': { text: 'Đã đóng', className: 'status-closed' },
    };
    
    const statusInfo = statusMap[status] || { text: status, className: 'status-default' };
    return <span className={`status-badge ${statusInfo.className}`}>{statusInfo.text}</span>;
  };

  return (
    <div className="topic-card">
      <div className="topic-card-header">
        <h3 className="topic-title">{topic.ten_de_tai}</h3>
        {getStatusBadge(topic.trang_thai)}
      </div>

      <div className="topic-card-body">
        <p className="topic-code">Mã đề tài: {topic.ma_de_tai}</p>
        
        {topic.LinhVucNghienCuu && (
          <p className="topic-field">
            <span className="label">Lĩnh vực:</span> {topic.LinhVucNghienCuu.ten_linh_vuc}
          </p>
        )}

        {topic.GiangVien && (
          <p className="topic-lecturer">
            <span className="label">GVHD:</span> {topic.GiangVien.ho_ten}
          </p>
        )}

        <p className="topic-members">
          <span className="label">Số lượng thành viên:</span> Tối đa {topic.so_luong_thanh_vien_toi_da} người
        </p>

        {topic.mo_ta && (
          <p className="topic-description">
            {topic.mo_ta.length > 150 
              ? `${topic.mo_ta.substring(0, 150)}...` 
              : topic.mo_ta}
          </p>
        )}
      </div>

      <div className="topic-card-footer">
        <button 
          className="btn-view-detail" 
          onClick={handleViewDetail}
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default TopicCard;
