// Component danh sách thành viên nhóm
// Thành viên 2: Màn hình tạo nhóm đăng ký đề tài

import React from 'react';
import '../styles/MemberList.css';

const MemberList = ({ members, maxMembers, onRemove, readOnly = false }) => {
  const getRoleBadge = (role) => {
    if (role === 'TRUONG_NHOM') {
      return <span className="role-badge leader">Trưởng nhóm</span>;
    }
    return <span className="role-badge member">Thành viên</span>;
  };

  return (
    <div className="member-list">
      <div className="member-list-header">
        <h3>Danh sách thành viên ({members.length}/{maxMembers})</h3>
      </div>

      {members.length === 0 ? (
        <div className="no-members">Chưa có thành viên nào</div>
      ) : (
        <div className="member-items">
          {members.map((member, index) => (
            <div key={index} className="member-item">
              <div className="member-info">
                <div className="member-avatar">
                  {member.SinhVien.ho_ten.charAt(0).toUpperCase()}
                </div>
                <div className="member-details">
                  <h4>{member.SinhVien.ho_ten}</h4>
                  <p className="member-code">MSSV: {member.SinhVien.ma_sinh_vien}</p>
                  {member.SinhVien.email && (
                    <p className="member-email">{member.SinhVien.email}</p>
                  )}
                  {member.SinhVien.Khoa && (
                    <p className="member-faculty">{member.SinhVien.Khoa.ten_khoa}</p>
                  )}
                </div>
              </div>

              <div className="member-actions">
                {getRoleBadge(member.vai_tro_trong_nhom)}
                {!readOnly && member.vai_tro_trong_nhom !== 'TRUONG_NHOM' && (
                  <button
                    className="btn-remove"
                    onClick={() => onRemove(member.SinhVien.sinh_vien_id)}
                    title="Xóa thành viên"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberList;
