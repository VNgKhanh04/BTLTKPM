// Component hiển thị trạng thái hồ sơ đăng ký
// Thành viên 4: Màn hình nộp hồ sơ đăng ký đề tài

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getRegistrationTopic,
  getRegistrationTypeLabel,
  isProposalRegistration,
  registrationAPI,
} from '../services/api';
import '../styles/RegistrationStatus.css';

function RegistrationStatus() {
  const { registrationId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const loadRegistrationData = async () => {
      try {
        setLoading(true);

        const [registrationData, timelineData] = await Promise.all([
          registrationAPI.getById(registrationId),
          registrationAPI.getTimeline(registrationId),
        ]);

        setRegistration(registrationData);
        setTimeline(Array.isArray(timelineData) ? timelineData : []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRegistrationData();
  }, [registrationId]);

  const getStatusInfo = (status) => {
    const statusMap = {
      'CHO_PHE_DUYET': {
        label: 'Chờ phê duyệt',
        color: 'warning',
        icon: '⏳',
        description: 'Hồ sơ đang chờ được xem xét'
      },
      'DA_NOP': {
        label: 'Đã nộp',
        color: 'info',
        icon: '📝',
        description: 'Hồ sơ đã được nộp và đang chờ xử lý'
      },
      'DA_DUYET': {
        label: 'Đã duyệt',
        color: 'success',
        icon: '✅',
        description: 'Hồ sơ đã được phê duyệt'
      },
      'TU_CHOI': {
        label: 'Từ chối',
        color: 'danger',
        icon: '❌',
        description: 'Hồ sơ bị từ chối'
      },
      'CAN_CHINH_SUA': {
        label: 'Cần chỉnh sửa',
        color: 'warning',
        icon: '✏️',
        description: 'Hồ sơ cần được chỉnh sửa và nộp lại'
      }
    };
    return statusMap[status] || statusMap['CHO_PHE_DUYET'];
  };

  if (loading) {
    return <div className="registration-status-loading">Đang tải thông tin...</div>;
  }

  if (error) {
    return <div className="registration-status-error">Lỗi: {error}</div>;
  }

  if (!registration) {
    return <div className="registration-status-error">Không tìm thấy hồ sơ</div>;
  }

  const statusInfo = getStatusInfo(registration.trang_thai);
  const registrationDate = registration.ngay_dang_ky || registration.ngay_tao;
  const topic = getRegistrationTopic(registration);
  const groupId = registration.nhom_id || registration.NhomNghienCuu?.nhom_id;
  const isProposalFlow = isProposalRegistration(registration);
  const canEditRegistration = registration.trang_thai === 'CAN_CHINH_SUA' && groupId;

  return (
    <div className="registration-status-container">
      <div className="registration-status-header">
        <h2>Trạng thái hồ sơ đăng ký</h2>
        <div className={`status-badge status-${statusInfo.color}`}>
          <span className="status-icon">{statusInfo.icon}</span>
          <span className="status-label">{statusInfo.label}</span>
        </div>
      </div>

      <div className="registration-status-content">
        {/* Thông tin cơ bản */}
        <section className="status-section">
          <h3 className="section-title">📋 Thông tin hồ sơ</h3>
          <div className="info-card">
            <div className="info-row">
              <span className="info-label">Mã hồ sơ:</span>
              <span className="info-value">HS{registration.ho_so_id.toString().padStart(6, '0')}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ngày đăng ký:</span>
              <span className="info-value">
                {registrationDate ? new Date(registrationDate).toLocaleString('vi-VN') : 'Chưa cập nhật'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Trạng thái:</span>
              <span className={`status-text status-${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Loại đăng ký:</span>
              <span className="info-value">{getRegistrationTypeLabel(registration)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Mô tả:</span>
              <p className="info-value">{statusInfo.description}</p>
            </div>
          </div>
        </section>

        {/* Thông tin đề tài */}
        <section className="status-section">
          <h3 className="section-title">{isProposalFlow ? '💡 Đề tài đề xuất' : '📚 Đề tài đăng ký'}</h3>
          <div className="info-card">
            {isProposalFlow ? (
              <>
                <div className="info-row">
                  <span className="info-label">Tên đề tài:</span>
                  <span className="info-value">{registration.ten_de_tai_de_xuat || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Lĩnh vực:</span>
                  <span className="info-value">
                    {registration.LinhVucDeXuat?.ten_linh_vuc || 'Chưa cập nhật'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Mô tả:</span>
                  <p className="info-value">{registration.mo_ta_de_xuat || 'Chưa cập nhật'}</p>
                </div>
                <div className="info-row">
                  <span className="info-label">Mục tiêu:</span>
                  <p className="info-value">{registration.muc_tieu_de_xuat || 'Chưa cập nhật'}</p>
                </div>
                <div className="info-row">
                  <span className="info-label">Yêu cầu:</span>
                  <p className="info-value">{registration.yeu_cau_de_xuat || 'Chưa cập nhật'}</p>
                </div>
              </>
            ) : (
              <>
                <div className="info-row">
                  <span className="info-label">Mã đề tài:</span>
                  <span className="info-value">{topic?.ma_de_tai || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Tên đề tài:</span>
                  <span className="info-value">{topic?.ten_de_tai || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Lĩnh vực:</span>
                  <span className="info-value">
                    {topic?.LinhVucNghienCuu?.ten_linh_vuc || 'Chưa cập nhật'}
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Thông tin nhóm */}
        <section className="status-section">
          <h3 className="section-title">👥 Thông tin nhóm</h3>
          <div className="info-card">
            <div className="info-row">
              <span className="info-label">Tên nhóm:</span>
              <span className="info-value">{registration.NhomNghienCuu?.ten_nhom}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Trưởng nhóm:</span>
              <span className="info-value">
                {registration.NhomNghienCuu?.SinhVien?.ho_ten}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Số thành viên:</span>
              <span className="info-value">
                {registration.NhomNghienCuu?.so_luong_thanh_vien || registration.NhomNghienCuu?.ThanhVienNhom?.length || 0}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Giảng viên hướng dẫn:</span>
              <span className="info-value">
                {registration.NhomNghienCuu?.GiangVien?.ho_ten || 'Chưa có'}
              </span>
            </div>
          </div>
        </section>

        {/* Lý do chọn đề tài */}
        {registration.ly_do_chon_de_tai && (
          <section className="status-section">
            <h3 className="section-title">📝 Lý do chọn đề tài</h3>
            <div className="info-card">
              <p className="reason-text">{registration.ly_do_chon_de_tai}</p>
            </div>
          </section>
        )}

        {/* Ghi chú (nếu có) */}
        {registration.ghi_chu && (
          <section className="status-section">
            <h3 className="section-title">💬 Ghi chú từ giảng viên</h3>
            <div className="info-card note-card">
              <p className="note-text">{registration.ghi_chu}</p>
            </div>
          </section>
        )}

        {/* Timeline */}
        {timeline.length > 0 && (
          <section className="status-section">
            <h3 className="section-title">📅 Lịch sử xử lý</h3>
            <div className="timeline">
              {timeline.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-time">
                      {new Date(item.thoi_gian).toLocaleString('vi-VN')}
                    </div>
                    <div className="timeline-action">{item.hanh_dong}</div>
                    {item.nhan_xet && (
                      <div className="timeline-note">{item.nhan_xet}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="registration-status-actions">
        <button 
          onClick={() => navigate('/topics')} 
          className="btn-back"
        >
          Về trang chủ
        </button>
        {canEditRegistration && (
          <button 
            onClick={() => navigate(`/register-topic/review/${groupId}`)}
            className="btn-edit"
          >
            Chỉnh sửa hồ sơ
          </button>
        )}
      </div>
    </div>
  );
}

export default RegistrationStatus;
