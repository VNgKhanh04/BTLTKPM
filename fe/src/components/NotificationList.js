// Component danh sách thông báo
// Thành viên 5: Validation & Thông báo

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { notificationAPI } from '../services/api';
import NotificationItem from './NotificationItem';
import '../styles/NotificationList.css';

const RECIPIENT_TYPES = [
  { value: 'SINH_VIEN', label: 'Sinh viên' },
  { value: 'GIANG_VIEN', label: 'Giảng viên' },
];

function NotificationList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [unreadCount, setUnreadCount] = useState(0);
  const [recipientForm, setRecipientForm] = useState(() => ({
    nguoiNhanId: searchParams.get('nguoiNhanId') || '',
    loaiNguoiNhan: searchParams.get('loaiNguoiNhan') || 'SINH_VIEN',
  }));

  const recipientContext = useMemo(() => {
    const recipientId = searchParams.get('nguoiNhanId');
    const recipientType = searchParams.get('loaiNguoiNhan');

    if (!recipientId || !recipientType) {
      return null;
    }

    return {
      nguoiNhanId: recipientId,
      loaiNguoiNhan: recipientType,
    };
  }, [searchParams]);

  useEffect(() => {
    setRecipientForm({
      nguoiNhanId: searchParams.get('nguoiNhanId') || '',
      loaiNguoiNhan: searchParams.get('loaiNguoiNhan') || 'SINH_VIEN',
    });
  }, [searchParams]);

  const fetchUnreadCount = useCallback(async () => {
    if (!recipientContext) {
      setUnreadCount(0);
      return;
    }

    try {
      const data = await notificationAPI.getUnreadCount(
        recipientContext.nguoiNhanId,
        recipientContext.loaiNguoiNhan
      );
      setUnreadCount(data?.count || 0);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, [recipientContext]);

  const fetchNotifications = useCallback(async () => {
    if (!recipientContext) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await notificationAPI.getList({
        nguoiNhanId: recipientContext.nguoiNhanId,
        loaiNguoiNhan: recipientContext.loaiNguoiNhan,
        daDoc: filter === 'all' ? undefined : filter === 'read',
      });

      setNotifications(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, recipientContext]);

  useEffect(() => {
    if (recipientContext) {
      fetchNotifications();
      fetchUnreadCount();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      setError(null);
    }
  }, [fetchNotifications, fetchUnreadCount, recipientContext]);

  const handleRecipientSubmit = (e) => {
    e.preventDefault();

    const trimmedRecipientId = recipientForm.nguoiNhanId.trim();

    if (!trimmedRecipientId) {
      setError('Vui lòng nhập mã người nhận để xem thông báo');
      return;
    }

    setError(null);
    setFilter('all');
    setSearchParams({
      nguoiNhanId: trimmedRecipientId,
      loaiNguoiNhan: recipientForm.loaiNguoiNhan,
    });
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);

      // Cập nhật state
      setNotifications((currentNotifications) => {
        if (filter === 'unread') {
          return currentNotifications.filter((notif) => notif.thong_bao_id !== notificationId);
        }

        return currentNotifications.map((notif) =>
          notif.thong_bao_id === notificationId
            ? { ...notif, da_doc: true }
            : notif
        );
      });
      setUnreadCount((currentCount) => Math.max(currentCount - 1, 0));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  if (loading) {
    return (
      <div className="notification-list-container">
        <div className="notification-loading">Đang tải thông báo...</div>
      </div>
    );
  }

  return (
    <div className="notification-list-container">
      <div className="notification-header">
        <h2>Thông báo</h2>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount} chưa đọc</span>
        )}
      </div>

      <form onSubmit={handleRecipientSubmit} className="notification-context-form">
        <div className="notification-context-fields">
          <div className="notification-context-group">
            <label htmlFor="notificationRecipientType">Loại người nhận</label>
            <select
              id="notificationRecipientType"
              value={recipientForm.loaiNguoiNhan}
              onChange={(e) => setRecipientForm((current) => ({
                ...current,
                loaiNguoiNhan: e.target.value,
              }))}
              className="notification-context-input"
            >
              {RECIPIENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="notification-context-group">
            <label htmlFor="notificationRecipientId">Mã người nhận</label>
            <input
              id="notificationRecipientId"
              type="text"
              value={recipientForm.nguoiNhanId}
              onChange={(e) => setRecipientForm((current) => ({
                ...current,
                nguoiNhanId: e.target.value,
              }))}
              placeholder="Nhập ID sinh viên hoặc giảng viên"
              className="notification-context-input"
            />
          </div>
        </div>

        <div className="notification-context-actions">
          <button type="submit" className="filter-btn active">
            Xem thông báo
          </button>
        </div>
      </form>

      {error && <div className="notification-error">Lỗi: {error}</div>}

      {recipientContext && (
        <div className="notification-context-summary">
          Đang xem thông báo của {recipientContext.loaiNguoiNhan === 'GIANG_VIEN' ? 'giảng viên' : 'sinh viên'} có mã{' '}
          <strong>{recipientContext.nguoiNhanId}</strong>
        </div>
      )}

      <div className="notification-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tất cả
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Chưa đọc
        </button>
        <button
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Đã đọc
        </button>
      </div>

      <div className="notification-list">
        {!recipientContext ? (
          <div className="notification-empty">
            Chọn loại người nhận và nhập mã để tải danh sách thông báo.
          </div>
        ) : notifications.length === 0 ? (
          <div className="notification-empty">
            {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Không có thông báo'}
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.thong_bao_id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationList;
