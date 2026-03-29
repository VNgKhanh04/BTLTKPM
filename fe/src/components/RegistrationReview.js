// Component review hồ sơ đăng ký trước khi nộp
// Thành viên 4: Màn hình nộp hồ sơ đăng ký đề tài

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fieldAPI,
  getRegistrationTopic,
  getRegistrationType,
  getRegistrationTypeLabel,
  groupAPI,
  isProposalRegistration,
  registrationAPI,
  topicAPI,
  REGISTRATION_TYPES,
} from '../services/api';
import '../styles/RegistrationReview.css';

function RegistrationReview() {
  const { topicId, groupId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [topic, setTopic] = useState(null);
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [fields, setFields] = useState([]);
  const [lyDoChonDeTai, setLyDoChonDeTai] = useState('');
  const [proposedTopic, setProposedTopic] = useState({
    tenDeTaiDeXuat: '',
    linhVucDeXuatId: '',
    moTaDeXuat: '',
    mucTieuDeXuat: '',
    yeuCauDeXuat: '',
  });
  const [existingRegistration, setExistingRegistration] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [groupData, membersData, registrationList, fieldsData] = await Promise.all([
        groupAPI.getById(groupId),
        groupAPI.getMembers(groupId),
        registrationAPI.getList({ nhomId: groupId }),
        fieldAPI.getList(),
      ]);

      const registrations = Array.isArray(registrationList) ? registrationList : [];

      const matchedRegistration = registrations.find(
        (item) => item.nhom_id === Number(groupId)
      ) || null;

      let currentTopic = groupData?.DeTaiNghienCuu || matchedRegistration?.DeTaiNghienCuu || null;
      const registrationType = getRegistrationType(matchedRegistration || groupData);

      if (registrationType === REGISTRATION_TYPES.EXISTING_TOPIC && !currentTopic && topicId) {
        try {
          currentTopic = await topicAPI.getById(topicId);
        } catch (topicError) {
          console.error('Không thể tải đề tài từ route cũ:', topicError);
        }
      }

      setTopic(currentTopic);
      setGroup(groupData);
      setMembers(membersData);
      setFields(Array.isArray(fieldsData) ? fieldsData : []);
      setExistingRegistration(matchedRegistration);
      setLyDoChonDeTai(matchedRegistration?.ly_do_chon_de_tai || '');
      setProposedTopic({
        tenDeTaiDeXuat: matchedRegistration?.ten_de_tai_de_xuat || '',
        linhVucDeXuatId: matchedRegistration?.linh_vuc_de_xuat_id
          ? String(matchedRegistration.linh_vuc_de_xuat_id)
          : '',
        moTaDeXuat: matchedRegistration?.mo_ta_de_xuat || '',
        mucTieuDeXuat: matchedRegistration?.muc_tieu_de_xuat || '',
        yeuCauDeXuat: matchedRegistration?.yeu_cau_de_xuat || '',
      });
      
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [groupId, topicId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const registrationType = getRegistrationType(existingRegistration || group);
    const isProposalFlow = registrationType === REGISTRATION_TYPES.PROPOSED_TOPIC;
    const selectedTopic = topic || getRegistrationTopic(existingRegistration);
    const normalizedProposal = {
      tenDeTaiDeXuat: proposedTopic.tenDeTaiDeXuat.trim(),
      linhVucDeXuatId: proposedTopic.linhVucDeXuatId,
      moTaDeXuat: proposedTopic.moTaDeXuat.trim(),
      mucTieuDeXuat: proposedTopic.mucTieuDeXuat.trim(),
      yeuCauDeXuat: proposedTopic.yeuCauDeXuat.trim(),
    };
    
    if (!lyDoChonDeTai.trim()) {
      setError('Vui lòng nhập lý do chọn đề tài');
      return;
    }

    if (isProposalFlow) {
      if (!normalizedProposal.tenDeTaiDeXuat) {
        setError('Vui lòng nhập tên đề tài đề xuất');
        return;
      }

      if (!normalizedProposal.linhVucDeXuatId) {
        setError('Vui lòng chọn lĩnh vực đề xuất');
        return;
      }

      if (
        !normalizedProposal.moTaDeXuat &&
        !normalizedProposal.mucTieuDeXuat &&
        !normalizedProposal.yeuCauDeXuat
      ) {
        setError('Vui lòng nhập ít nhất mô tả, mục tiêu hoặc yêu cầu cho đề tài đề xuất');
        return;
      }
    }

    if (!group.giang_vien_huong_dan_id) {
      setError('Vui lòng chọn giảng viên hướng dẫn trước khi nộp hồ sơ');
      return;
    }

    if (!isProposalFlow && !selectedTopic?.de_tai_id) {
      setError('Không tìm thấy thông tin đề tài để tiếp tục đăng ký');
      return;
    }

    if (existingRegistration && existingRegistration.trang_thai !== 'CAN_CHINH_SUA') {
      navigate(`/registration-status/${existingRegistration.ho_so_id}`);
      return;
    }

    try {
      setSubmitting(true);

      setError(null);

      let hoSo;
      let submittedHoSo;

      if (existingRegistration?.ho_so_id) {
        const updatePayload = {
          ly_do_chon_de_tai: lyDoChonDeTai.trim(),
          loai_dang_ky: registrationType,
          trang_thai: 'CHO_PHE_DUYET',
        };

        if (isProposalFlow) {
          updatePayload.de_tai_id = null;
          updatePayload.ten_de_tai_de_xuat = normalizedProposal.tenDeTaiDeXuat;
          updatePayload.linh_vuc_de_xuat_id = parseInt(normalizedProposal.linhVucDeXuatId, 10);
          updatePayload.mo_ta_de_xuat = normalizedProposal.moTaDeXuat;
          updatePayload.muc_tieu_de_xuat = normalizedProposal.mucTieuDeXuat;
          updatePayload.yeu_cau_de_xuat = normalizedProposal.yeuCauDeXuat;
        } else {
          updatePayload.de_tai_id = selectedTopic.de_tai_id;
        }

        hoSo = await registrationAPI.update(existingRegistration.ho_so_id, updatePayload);
      } else {
        const createPayload = {
          nhomId: parseInt(groupId, 10),
          lyDoChonDeTai: lyDoChonDeTai.trim(),
          nguoiTaoId: group.truong_nhom_id,
          loaiDangKy: registrationType,
        };

        if (isProposalFlow) {
          createPayload.tenDeTaiDeXuat = normalizedProposal.tenDeTaiDeXuat;
          createPayload.linhVucDeXuatId = parseInt(normalizedProposal.linhVucDeXuatId, 10);
          createPayload.moTaDeXuat = normalizedProposal.moTaDeXuat;
          createPayload.mucTieuDeXuat = normalizedProposal.mucTieuDeXuat;
          createPayload.yeuCauDeXuat = normalizedProposal.yeuCauDeXuat;
        } else {
          createPayload.deTaiId = selectedTopic.de_tai_id;
        }

        hoSo = await registrationAPI.create(createPayload);
      }

      submittedHoSo = await registrationAPI.submit(hoSo.ho_so_id);

      setExistingRegistration(submittedHoSo);
      
      alert(
        existingRegistration?.ho_so_id
          ? 'Đã cập nhật và nộp lại hồ sơ đăng ký thành công!'
          : 'Đã nộp hồ sơ đăng ký thành công!'
      );
      navigate(`/registration-status/${submittedHoSo.ho_so_id}`);
    } catch (err) {
      setError(err.message);
      alert(`Lỗi: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="registration-review-loading">Đang tải thông tin...</div>;
  }

  const hasLockedRegistration = existingRegistration && existingRegistration.trang_thai !== 'CAN_CHINH_SUA';
  const isProposalFlow = isProposalRegistration(existingRegistration || group);
  const selectedTopic = topic || getRegistrationTopic(existingRegistration);
  const selectedProposedField = fields.find(
    (field) => String(field.linh_vuc_id) === proposedTopic.linhVucDeXuatId
  ) || existingRegistration?.LinhVucDeXuat;

  const handleProposedTopicChange = (fieldName, value) => {
    setProposedTopic((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <div className="registration-review-container">
      <div className="registration-review-header">
        <h2>{isProposalFlow ? 'Xác nhận hồ sơ đề xuất đề tài' : 'Xác nhận hồ sơ đăng ký đề tài'}</h2>
        <p className="review-subtitle">
          {existingRegistration?.ho_so_id
            ? 'Cập nhật lại hồ sơ theo phản hồi trước khi gửi lại'
            : 'Vui lòng kiểm tra kỹ thông tin trước khi nộp'}
        </p>
        <p className="review-type-label">Loại đăng ký: {getRegistrationTypeLabel(existingRegistration || group)}</p>
      </div>

      {error && <div className="registration-review-error">Lỗi: {error}</div>}

      {hasLockedRegistration && (
        <div className="warning-message">
          Hồ sơ của nhóm này đã được tạo. Vui lòng xem trạng thái hiện tại thay vì tạo mới.
        </div>
      )}

      <div className="registration-review-content">
        {/* Thông tin đề tài */}
        <section className="review-section">
          <h3 className="section-title">{isProposalFlow ? '💡 Thông tin đề tài đề xuất' : '📚 Thông tin đề tài'}</h3>
          {isProposalFlow ? (
            <>
              <div className="info-card proposal-note-card">
                <div className="info-row">
                  <span className="info-label">Nhánh xử lý:</span>
                  <span className="info-value">Đề xuất đề tài mới trong cùng quy trình đăng ký</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Giảng viên:</span>
                  <span className="info-value">Bạn đã chọn giảng viên trước, giờ hoàn thiện hồ sơ đề xuất.</span>
                </div>
              </div>

              <div className="proposal-form-grid">
                <div className="form-group">
                  <label htmlFor="tenDeTaiDeXuat">Tên đề tài đề xuất *</label>
                  <input
                    type="text"
                    id="tenDeTaiDeXuat"
                    value={proposedTopic.tenDeTaiDeXuat}
                    onChange={(e) => handleProposedTopicChange('tenDeTaiDeXuat', e.target.value)}
                    placeholder="Nhập tên đề tài mà nhóm muốn đề xuất"
                    className="proposal-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="linhVucDeXuatId">Lĩnh vực đề xuất *</label>
                  <select
                    id="linhVucDeXuatId"
                    value={proposedTopic.linhVucDeXuatId}
                    onChange={(e) => handleProposedTopicChange('linhVucDeXuatId', e.target.value)}
                    className="proposal-input"
                  >
                    <option value="">Chọn lĩnh vực nghiên cứu</option>
                    {fields.map((field) => (
                      <option key={field.linh_vuc_id} value={field.linh_vuc_id}>
                        {field.ten_linh_vuc}
                      </option>
                    ))}
                  </select>
                  {selectedProposedField && (
                    <div className="selected-field-hint">Đang chọn: {selectedProposedField.ten_linh_vuc}</div>
                  )}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="moTaDeXuat">Mô tả đề tài</label>
                  <textarea
                    id="moTaDeXuat"
                    value={proposedTopic.moTaDeXuat}
                    onChange={(e) => handleProposedTopicChange('moTaDeXuat', e.target.value)}
                    placeholder="Mô tả ngắn về ý tưởng nghiên cứu của nhóm"
                    rows="4"
                    className="reason-textarea"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="mucTieuDeXuat">Mục tiêu đề tài</label>
                  <textarea
                    id="mucTieuDeXuat"
                    value={proposedTopic.mucTieuDeXuat}
                    onChange={(e) => handleProposedTopicChange('mucTieuDeXuat', e.target.value)}
                    placeholder="Nhóm muốn đạt được điều gì với đề tài này?"
                    rows="4"
                    className="reason-textarea"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="yeuCauDeXuat">Yêu cầu / phạm vi thực hiện</label>
                  <textarea
                    id="yeuCauDeXuat"
                    value={proposedTopic.yeuCauDeXuat}
                    onChange={(e) => handleProposedTopicChange('yeuCauDeXuat', e.target.value)}
                    placeholder="Các yêu cầu, điều kiện hoặc phạm vi dự kiến cho đề tài"
                    rows="4"
                    className="reason-textarea"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="info-card">
              <div className="info-row">
                <span className="info-label">Mã đề tài:</span>
                <span className="info-value">{selectedTopic?.ma_de_tai || 'Chưa cập nhật'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Tên đề tài:</span>
                <span className="info-value">{selectedTopic?.ten_de_tai || 'Chưa cập nhật'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Lĩnh vực:</span>
                <span className="info-value">{selectedTopic?.LinhVucNghienCuu?.ten_linh_vuc || 'Chưa cập nhật'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Mô tả:</span>
                <p className="info-value">{selectedTopic?.mo_ta || 'Chưa cập nhật'}</p>
              </div>
            </div>
          )}
        </section>

        {/* Thông tin nhóm */}
        <section className="review-section">
          <h3 className="section-title">👥 Thông tin nhóm</h3>
          <div className="info-card">
            <div className="info-row">
              <span className="info-label">Mã nhóm:</span>
              <span className="info-value">{group?.ma_nhom}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Tên nhóm:</span>
              <span className="info-value">{group?.ten_nhom}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Trưởng nhóm:</span>
              <span className="info-value">{group?.SinhVien?.ho_ten}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Số thành viên:</span>
              <span className="info-value">{members.length}</span>
            </div>
          </div>

          <div className="members-list">
            <h4>Danh sách thành viên:</h4>
            <ul>
              {members.map((member, index) => (
                <li key={member.thanh_vien_nhom_id}>
                  {index + 1}. {member.SinhVien.ho_ten} ({member.SinhVien.ma_sinh_vien})
                  {member.vai_tro_trong_nhom === 'TRUONG_NHOM' && (
                    <span className="role-badge">Trưởng nhóm</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Thông tin giảng viên hướng dẫn */}
        <section className="review-section">
          <h3 className="section-title">👨‍🏫 Giảng viên hướng dẫn</h3>
          <div className="info-card">
            {group?.GiangVien ? (
              <>
                <div className="info-row">
                  <span className="info-label">Họ tên:</span>
                  <span className="info-value">{group.GiangVien.ho_ten}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{group.GiangVien.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Chuyên môn:</span>
                  <span className="info-value">{group.GiangVien.chuyen_mon}</span>
                </div>
              </>
            ) : (
              <div className="warning-message">
                ⚠️ Chưa chọn giảng viên hướng dẫn
              </div>
            )}
          </div>
        </section>

        {/* Lý do chọn đề tài */}
        <section className="review-section">
          <h3 className="section-title">📝 Lý do chọn đề tài</h3>
          <div className="form-group">
            <textarea
              value={lyDoChonDeTai}
              onChange={(e) => setLyDoChonDeTai(e.target.value)}
              placeholder={isProposalFlow
                ? 'Nhập lý do nhóm bạn đề xuất hướng nghiên cứu này và vì sao phù hợp với năng lực của nhóm...'
                : 'Nhập lý do nhóm bạn chọn đề tài này (tối thiểu 50 ký tự)...'}
              rows="6"
              className="reason-textarea"
              required
            />
            <div className="char-count">
              {lyDoChonDeTai.length} ký tự
            </div>
          </div>
        </section>
      </div>

      <div className="registration-review-actions">
        <button 
          onClick={() => navigate(-1)} 
          className="btn-back"
          disabled={submitting}
        >
          Quay lại
        </button>
        {hasLockedRegistration ? (
          <button
            onClick={() => navigate(`/registration-status/${existingRegistration.ho_so_id}`)}
            className="btn-submit"
          >
            Xem trạng thái hồ sơ
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            className="btn-submit"
            disabled={submitting || !group?.GiangVien || (!isProposalFlow && !selectedTopic)}
          >
            {submitting
              ? 'Đang xử lý...'
              : existingRegistration?.ho_so_id
                ? 'Cập nhật và gửi lại hồ sơ'
                : 'Xác nhận nộp hồ sơ'}
          </button>
        )}
      </div>
    </div>
  );
}

export default RegistrationReview;
