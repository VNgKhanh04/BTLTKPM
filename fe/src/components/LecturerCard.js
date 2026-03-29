// Component card hiển thị thông tin giảng viên
// Thành viên 3: Màn hình chọn giảng viên hướng dẫn

import React from 'react';
import '../styles/LecturerCard.css';

function LecturerCard({ lecturer, onSelect }) {
  const { giang_vien_id, ma_giang_vien, ho_ten, email, so_dien_thoai, chuyen_mon, Khoa, quota } = lecturer;

  const canSelect = quota && quota.co_the_nhan_them;
  const availableSlots = quota ? quota.con_cho : 0;
  const currentlySupervising = quota ? quota.so_luong_dang_huong_dan : 0;
  const maxSupervising = quota ? quota.so_luong_toi_da : 0;

  return (
    <div className={`lecturer-card ${!canSelect ? 'lecturer-card-full' : ''}`}>
      <div className="lecturer-card-header">
        <h3 className="lecturer-name">{ho_ten}</h3>
        <span className="lecturer-code">{ma_giang_vien}</span>
      </div>

      <div className="lecturer-card-body">
        <div className="lecturer-info-row">
          <span className="lecturer-label">Khoa:</span>
          <span className="lecturer-value">{Khoa?.ten_khoa || 'N/A'}</span>
        </div>

        <div className="lecturer-info-row">
          <span className="lecturer-label">Email:</span>
          <span className="lecturer-value">{email}</span>
        </div>

        {so_dien_thoai && (
          <div className="lecturer-info-row">
            <span className="lecturer-label">SĐT:</span>
            <span className="lecturer-value">{so_dien_thoai}</span>
          </div>
        )}

        <div className="lecturer-specialization">
          <span className="lecturer-label">Chuyên môn:</span>
          <p className="lecturer-value">{chuyen_mon || 'Chưa cập nhật'}</p>
        </div>

        <div className="lecturer-quota">
          <div className="quota-info">
            <span className="quota-label">Đang hướng dẫn:</span>
            <span className="quota-value">
              {currentlySupervising}/{maxSupervising}
            </span>
          </div>
          <div className={`quota-status ${canSelect ? 'quota-available' : 'quota-full'}`}>
            {canSelect ? (
              <>
                <span className="quota-icon">✓</span>
                <span>Còn {availableSlots} chỗ</span>
              </>
            ) : (
              <>
                <span className="quota-icon">✕</span>
                <span>Đã đủ quota</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="lecturer-card-footer">
        <button
          onClick={() => onSelect(giang_vien_id)}
          disabled={!canSelect}
          className={`btn-select-lecturer ${!canSelect ? 'btn-disabled' : ''}`}
        >
          {canSelect ? 'Chọn giảng viên' : 'Không thể chọn'}
        </button>
      </div>
    </div>
  );
}

export default LecturerCard;
