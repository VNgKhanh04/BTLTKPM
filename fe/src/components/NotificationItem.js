// Component item thông báo
// Thành viên 5: Validation & Thông báo

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NotificationItem.css';

function NotificationItem({ notification, onMarkAsRead }) {
  const navigate = useNavigate();

  const normalizeNotificationPath = (path) => {
    if (!path) {
      return null;
    }

    const registrationEditMatch = path.match(/^\/registration-edit\/(\d+)$/);

    if (registrationEditMatch) {
      return `/registration-status/${registrationEditMatch[1]}`;
    }

    return path;
  };

  const getNotificationIcon = (loaiThongBao) => {
    const iconMap = {
      'DANG_KY_DE_TAI': '📝',
      'PHE_DUYET': '✅',
      'TU_CHOI': '❌',
      'CAN_CHINH_SUA': '✏️',
      'THONG_BAO_CHUNG': '📢',
      'NHAC_NHO': '⏰'
    };
    return iconMap[loaiThongBao] || '📬';
  };

  const handleClick = () => {
    // Đánh dấu đã đọc nếu chưa đọc
    if (!notification.da_doc) {
      onMarkAsRead(notification.thong_bao_id);
    }

    // Navigate nếu có đường dẫn
    const targetPath = normalizeNotificationPath(notification.duong_dan);

    if (targetPath) {
      navigate(targetPath);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div
      className={`notification-item ${!notification.da_doc ? 'unread' : ''}`}
      onClick={handleClick}
    >
      <div className="notification-icon">
        {getNotificationIcon(notification.loai_thong_bao)}
      </div>
      
      <div className="notification-content">
        <div className="notification-title">
          {notification.tieu_de}
          {!notification.da_doc && <span className="new-badge">Mới</span>}
        </div>
        <div className="notification-body">
          {notification.noi_dung}
        </div>
        <div className="notification-time">
          {formatTime(notification.thoi_gian_gui)}
        </div>
      </div>

      {!notification.da_doc && (
        <button
          className="mark-read-btn"
          onClick={(e) => {
            e.stopPropagation();
            onMarkAsRead(notification.thong_bao_id);
          }}
          title="Đánh dấu đã đọc"
        >
          ✓
        </button>
      )}
    </div>
  );
}

export default NotificationItem;
