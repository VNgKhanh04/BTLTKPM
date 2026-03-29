// Component tạo nhóm nghiên cứu
// Thành viên 2: Màn hình tạo nhóm đăng ký đề tài

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupAPI, topicAPI, REGISTRATION_TYPES } from '../services/api';
import MemberList from './MemberList';
import AddMemberForm from './AddMemberForm';
import '../styles/CreateGroup.css';

const CreateGroup = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const isProposalFlow = !topicId;
  
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Tạo nhóm, 2: Thêm thành viên, 3: Xác nhận
  
  // Form data
  const [groupName, setGroupName] = useState('');
  const [leaderId, setLeaderId] = useState('');
  const [groupId, setGroupId] = useState(null);
  const [members, setMembers] = useState([]);
  const maxMembers = topic?.so_luong_thanh_vien_toi_da || 5;

  const loadTopicInfo = useCallback(async () => {
    if (isProposalFlow) {
      setTopic(null);
      setLoading(false);
      return;
    }

    try {
      const data = await topicAPI.getById(topicId);
      setTopic(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isProposalFlow, topicId]);

  useEffect(() => {
    loadTopicInfo();
  }, [loadTopicInfo]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setError(null);

    if (!groupName.trim()) {
      setError('Vui lòng nhập tên nhóm');
      return;
    }

    if (!leaderId) {
      setError('Vui lòng nhập mã sinh viên trưởng nhóm');
      return;
    }

    try {
      const payload = {
        tenNhom: groupName,
        truongNhomId: parseInt(leaderId),
        loaiDangKy: isProposalFlow
          ? REGISTRATION_TYPES.PROPOSED_TOPIC
          : REGISTRATION_TYPES.EXISTING_TOPIC,
      };

      if (!isProposalFlow) {
        payload.deTaiId = parseInt(topicId, 10);
      }

      const group = await groupAPI.create(payload);

      setGroupId(group.nhom_id);
      setMembers([{
        SinhVien: group.SinhVien,
        vai_tro_trong_nhom: 'TRUONG_NHOM'
      }]);
      setStep(2);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddMember = async (studentId) => {
    try {
      const result = await groupAPI.addMember(groupId, studentId);
      
      // Reload members
      const updatedMembers = await groupAPI.getMembers(groupId);
      setMembers(updatedMembers);
      
      return result;
    } catch (err) {
      throw err;
    }
  };

  const handleRemoveMember = async (studentId) => {
    try {
      await groupAPI.removeMember(groupId, studentId);
      
      // Reload members
      const updatedMembers = await groupAPI.getMembers(groupId);
      setMembers(updatedMembers);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNext = () => {
    if (members.length === 0) {
      setError('Nhóm phải có ít nhất 1 thành viên');
      return;
    }
    setStep(3);
  };

  const handleComplete = () => {
    // Chuyển sang màn hình chọn giảng viên (Thành viên 3)
    navigate(`/select-lecturer/${groupId}`);
  };

  if (loading) {
    return <div className="loading">Đang tải thông tin đề tài...</div>;
  }

  if (!isProposalFlow && !topic) {
    return <div className="error-message">Không tìm thấy đề tài</div>;
  }

  return (
    <div className="create-group-container">
      <h1>{isProposalFlow ? 'Tạo nhóm đề xuất đề tài mới' : 'Tạo nhóm đăng ký đề tài'}</h1>

      {/* Topic Info */}
      {isProposalFlow ? (
        <div className="topic-info-box proposal-info-box">
          <h3>Nhánh đề xuất đề tài mới</h3>
          <p>Nhóm của bạn sẽ chọn giảng viên trước, sau đó bổ sung thông tin đề tài ở bước rà soát hồ sơ.</p>
          <p>Số lượng thành viên tối đa mặc định: {maxMembers} người</p>
        </div>
      ) : (
        <div className="topic-info-box">
          <h3>{topic.ten_de_tai}</h3>
          <p>Mã đề tài: {topic.ma_de_tai}</p>
          <p>Số lượng thành viên tối đa: {maxMembers} người</p>
        </div>
      )}

      {/* Progress Steps */}
      <div className="progress-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Tạo nhóm</span>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">Thêm thành viên</span>
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Xác nhận</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Step 1: Create Group */}
      {step === 1 && (
        <div className="step-content">
          <h2>Bước 1: Thông tin nhóm</h2>
          <form onSubmit={handleCreateGroup} className="group-form">
            <div className="form-group">
              <label htmlFor="groupName">Tên nhóm *</label>
              <input
                type="text"
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Nhập tên nhóm nghiên cứu"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="leaderId">Mã sinh viên trưởng nhóm *</label>
              <input
                type="number"
                id="leaderId"
                value={leaderId}
                onChange={(e) => setLeaderId(e.target.value)}
                placeholder="Nhập mã sinh viên"
                required
              />
              <small>Trưởng nhóm sẽ tự động được thêm vào danh sách thành viên</small>
            </div>

            <button type="submit" className="btn-primary">
              Tạo nhóm và tiếp tục
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Add Members */}
      {step === 2 && (
        <div className="step-content">
          <h2>Bước 2: Thêm thành viên</h2>
          
          <MemberList 
            members={members}
            maxMembers={maxMembers}
            onRemove={handleRemoveMember}
          />

          {members.length < maxMembers && (
            <AddMemberForm onAdd={handleAddMember} />
          )}

          <div className="step-actions">
            <button onClick={() => setStep(1)} className="btn-secondary">
              Quay lại
            </button>
            <button onClick={handleNext} className="btn-primary">
              Tiếp tục
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="step-content">
          <h2>Bước 3: Xác nhận thông tin</h2>
          
          <div className="confirm-box">
            <h3>Thông tin nhóm</h3>
            <p><strong>Tên nhóm:</strong> {groupName}</p>
            <p><strong>Hình thức đăng ký:</strong> {isProposalFlow ? 'Đề xuất đề tài mới' : 'Đề tài có sẵn'}</p>
            <p><strong>Đề tài:</strong> {isProposalFlow ? 'Sẽ bổ sung ở bước rà soát hồ sơ' : topic.ten_de_tai}</p>
            <p><strong>Số lượng thành viên:</strong> {members.length}/{maxMembers}</p>
          </div>

          <MemberList 
            members={members}
            maxMembers={maxMembers}
            readOnly={true}
          />

          <div className="step-actions">
            <button onClick={() => setStep(2)} className="btn-secondary">
              Quay lại
            </button>
            <button onClick={handleComplete} className="btn-primary">
              Hoàn thành và chọn giảng viên
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateGroup;
