import React, { useEffect, useState } from 'react';
import './App.css';
import {
  authAPI,
  councilAPI,
  defenseScheduleAPI,
  fieldAPI,
  lecturerAPI,
  registrationAPI,
  storage,
  topicAPI,
} from './services/api';

const demoAccounts = [
  { username: 'SV001', password: '123456', role: 'Sinh viên' },
  { username: 'GV001', password: '123456', role: 'Giảng viên' },
  { username: 'CBQL001', password: '123456', role: 'Cán bộ quản lý' },
];

const initialRegistrationForm = {
  loaiDangKy: 'DE_TAI_CO_SAN',
  tenNhom: '',
  giangVienId: '',
  deTaiId: '',
  lyDoChonDeTai: '',
  tenDeTaiDeXuat: '',
  linhVucDeXuatId: '',
  moTaDeXuat: '',
  mucTieuDeXuat: '',
  yeuCauDeXuat: '',
};

function App() {
  const [sessionUser, setSessionUser] = useState(storage.getUser());
  const [loadingSession, setLoadingSession] = useState(true);
  const [authForm, setAuthForm] = useState({ tenDangNhap: '', matKhau: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [topics, setTopics] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [fields, setFields] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [lecturerRegistrations, setLecturerRegistrations] = useState([]);
  const [registrationForm, setRegistrationForm] = useState(initialRegistrationForm);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState('');
  const [pageMessage, setPageMessage] = useState('');
  const [reviewNotes, setReviewNotes] = useState({});

  const [eligibleTopics, setEligibleTopics] = useState([]);
  const [councils, setCouncils] = useState([]);
  const [defenseSchedules, setDefenseSchedules] = useState([]);
  const [defenseDrafts, setDefenseDrafts] = useState({});

  const isManager = ['CAN_BO_QUAN_LY', 'QUAN_TRI_HE_THONG'].includes(sessionUser?.vaiTro);

  useEffect(() => {
    const token = storage.getToken();
    if (!token) {
      setLoadingSession(false);
      return;
    }

    authAPI
      .getMe()
      .then((user) => setSessionUser(user))
      .catch(() => {
        authAPI.logout();
        setSessionUser(null);
      })
      .finally(() => setLoadingSession(false));
  }, []);

  useEffect(() => {
    if (!sessionUser) {
      return;
    }

    if (sessionUser.vaiTro === 'SINH_VIEN') {
      loadStudentData();
      return;
    }

    if (sessionUser.vaiTro === 'GIANG_VIEN') {
      loadLecturerData();
      return;
    }

    if (isManager) {
      loadManagerData();
    }
  }, [sessionUser, isManager]);

  const loadStudentData = async () => {
    setPageLoading(true);
    setPageError('');

    try {
      const [topicResult, lecturerResult, fieldResult, registrationResult] = await Promise.all([
        topicAPI.getList({ limit: 100 }),
        lecturerAPI.getList(),
        fieldAPI.getList(),
        registrationAPI.getMine(),
      ]);

      setTopics(topicResult.data || []);
      setLecturers(lecturerResult || []);
      setFields(fieldResult || []);
      setMyRegistrations(registrationResult || []);
    } catch (error) {
      setPageError(error.message);
    } finally {
      setPageLoading(false);
    }
  };

  const loadLecturerData = async () => {
    setPageLoading(true);
    setPageError('');

    try {
      const registrations = await registrationAPI.getAssignedToMe();
      setLecturerRegistrations(registrations || []);
    } catch (error) {
      setPageError(error.message);
    } finally {
      setPageLoading(false);
    }
  };

  const loadManagerData = async () => {
    setPageLoading(true);
    setPageError('');

    try {
      const [eligible, councilList, schedules] = await Promise.all([
        defenseScheduleAPI.getEligibleTopics(),
        councilAPI.getList(),
        defenseScheduleAPI.getList(),
      ]);

      setEligibleTopics(eligible || []);
      setCouncils(councilList || []);
      setDefenseSchedules(schedules || []);
      setDefenseDrafts((current) => buildDefenseDrafts(eligible || [], current));
    } catch (error) {
      setPageError(error.message);
    } finally {
      setPageLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const result = await authAPI.login(authForm);
      setSessionUser(result.user);
      setPageMessage(`Đăng nhập thành công với vai trò ${getRoleLabel(result.user.vaiTro)}`);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setSessionUser(null);
    setTopics([]);
    setLecturers([]);
    setFields([]);
    setMyRegistrations([]);
    setLecturerRegistrations([]);
    setEligibleTopics([]);
    setCouncils([]);
    setDefenseSchedules([]);
    setDefenseDrafts({});
    setRegistrationForm(initialRegistrationForm);
    setPageMessage('');
    setPageError('');
  };

  const handleRegistrationSubmit = async (event) => {
    event.preventDefault();
    setPageError('');
    setPageMessage('');
    setPageLoading(true);

    try {
      await registrationAPI.createAsStudent(registrationForm);
      setRegistrationForm(initialRegistrationForm);
      setPageMessage('Đã tạo đăng ký đề tài thành công');
      await loadStudentData();
    } catch (error) {
      setPageError(error.message);
    } finally {
      setPageLoading(false);
    }
  };

  const handleReview = async (registrationId, ketQua) => {
    setPageError('');
    setPageMessage('');
    setPageLoading(true);

    try {
      await registrationAPI.review(registrationId, {
        ketQua,
        nhanXet: reviewNotes[registrationId] || '',
      });
      setPageMessage(
        ketQua === 'CHAP_NHAN'
          ? 'Đã chấp nhận đề tài thành công'
          : 'Đã từ chối đề tài thành công'
      );
      await loadLecturerData();
    } catch (error) {
      setPageError(error.message);
    } finally {
      setPageLoading(false);
    }
  };

  const handleDraftChange = (draftKey, field, value) => {
    setDefenseDrafts((current) => ({
      ...current,
      [draftKey]: {
        ...current[draftKey],
        [field]: value,
      },
    }));
  };

  const handleCreateDefenseSchedules = async () => {
    setPageError('');
    setPageMessage('');
    setPageLoading(true);

    try {
      const lichBaoVeList = Object.values(defenseDrafts)
        .filter((draft) => draft.selected)
        .map((draft) => ({
          deTaiId: draft.deTaiId,
          nhomId: draft.nhomId,
          hoiDongId: draft.hoiDongId,
          thoiGianBatDau: draft.thoiGianBatDau,
          thoiGianKetThuc: draft.thoiGianKetThuc,
          diaDiem: draft.diaDiem,
          ghiChu: draft.ghiChu,
        }));

      await defenseScheduleAPI.createBulk({ lichBaoVeList });
      setPageMessage('Đã lập lịch bảo vệ đề tài thành công');
      await loadManagerData();
    } catch (error) {
      setPageError(error.message);
    } finally {
      setPageLoading(false);
    }
  };

  if (loadingSession) {
    return <div className="screen-center">Đang tải phiên đăng nhập...</div>;
  }

  if (!sessionUser) {
    return (
      <div className="auth-shell">
        <section className="auth-panel">
          <div className="auth-brand">
            <p className="eyebrow">Hệ thống NCKH sinh viên</p>
            <h1>Đăng nhập để thao tác nghiệp vụ</h1>
            <p className="auth-description">
              Sinh viên đăng ký đề tài, giảng viên duyệt đề tài, cán bộ quản lý tổ chức
              bảo vệ và xếp lịch bảo vệ cho các đề tài đủ điều kiện.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <label>
              <span>Tên đăng nhập</span>
              <input
                value={authForm.tenDangNhap}
                onChange={(event) =>
                  setAuthForm((current) => ({ ...current, tenDangNhap: event.target.value }))
                }
                placeholder="Ví dụ: SV001, GV001, CBQL001"
              />
            </label>

            <label>
              <span>Mật khẩu</span>
              <input
                type="password"
                value={authForm.matKhau}
                onChange={(event) =>
                  setAuthForm((current) => ({ ...current, matKhau: event.target.value }))
                }
                placeholder="Nhập mật khẩu"
              />
            </label>

            {authError ? <div className="feedback error">{authError}</div> : null}

            <button className="primary-button" type="submit" disabled={authLoading}>
              {authLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="demo-list">
            <h2>Tài khoản mẫu</h2>
            {demoAccounts.map((account) => (
              <button
                key={account.username}
                className="demo-account"
                type="button"
                onClick={() =>
                  setAuthForm({
                    tenDangNhap: account.username,
                    matKhau: account.password,
                  })
                }
              >
                <strong>{account.role}</strong>
                <span>{account.username} / {account.password}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Hệ thống Quản lý Nghiên cứu Khoa học</p>
          <h1>{getDashboardTitle(sessionUser.vaiTro)}</h1>
        </div>

        <div className="topbar-actions">
          <div className="user-chip">
            <strong>{sessionUser.profile?.ho_ten || sessionUser.tenDangNhap}</strong>
            <span>{sessionUser.tenDangNhap}</span>
          </div>
          <button className="secondary-button" type="button" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </header>

      {pageError ? <div className="feedback error">{pageError}</div> : null}
      {pageMessage ? <div className="feedback success">{pageMessage}</div> : null}

      {sessionUser.vaiTro === 'SINH_VIEN' ? (
        <div className="dashboard-grid">
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Đăng ký đề tài</p>
                <h2>Tạo đề tài đăng ký với giảng viên</h2>
              </div>
              {pageLoading ? <span className="status-tag">Đang xử lý...</span> : null}
            </div>

            <form className="form-grid" onSubmit={handleRegistrationSubmit}>
              <label>
                <span>Loại đăng ký</span>
                <select
                  value={registrationForm.loaiDangKy}
                  onChange={(event) =>
                    setRegistrationForm((current) => ({
                      ...current,
                      loaiDangKy: event.target.value,
                      deTaiId: '',
                    }))
                  }
                >
                  <option value="DE_TAI_CO_SAN">Đề tài có sẵn</option>
                  <option value="DE_XUAT_MOI">Đề xuất đề tài mới</option>
                </select>
              </label>

              <label>
                <span>Tên nhóm</span>
                <input
                  value={registrationForm.tenNhom}
                  onChange={(event) =>
                    setRegistrationForm((current) => ({ ...current, tenNhom: event.target.value }))
                  }
                  placeholder="Nhập tên nhóm"
                />
              </label>

              <label>
                <span>Giảng viên hướng dẫn</span>
                <select
                  value={registrationForm.giangVienId}
                  onChange={(event) =>
                    setRegistrationForm((current) => ({ ...current, giangVienId: event.target.value }))
                  }
                  required
                >
                  <option value="">Chọn giảng viên</option>
                  {lecturers.map((lecturer) => (
                    <option key={lecturer.giang_vien_id} value={lecturer.giang_vien_id}>
                      {lecturer.ho_ten} - {lecturer.chuyen_mon}
                    </option>
                  ))}
                </select>
              </label>

              {registrationForm.loaiDangKy === 'DE_TAI_CO_SAN' ? (
                <label className="full-width">
                  <span>Đề tài</span>
                  <select
                    value={registrationForm.deTaiId}
                    onChange={(event) =>
                      setRegistrationForm((current) => ({ ...current, deTaiId: event.target.value }))
                    }
                    required
                  >
                    <option value="">Chọn đề tài có sẵn</option>
                    {topics.map((topic) => (
                      <option key={topic.de_tai_id} value={topic.de_tai_id}>
                        {topic.ten_de_tai}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <>
                  <label className="full-width">
                    <span>Tên đề tài đề xuất</span>
                    <input
                      value={registrationForm.tenDeTaiDeXuat}
                      onChange={(event) =>
                        setRegistrationForm((current) => ({
                          ...current,
                          tenDeTaiDeXuat: event.target.value,
                        }))
                      }
                      placeholder="Nhập tên đề tài mới"
                      required
                    />
                  </label>

                  <label>
                    <span>Lĩnh vực</span>
                    <select
                      value={registrationForm.linhVucDeXuatId}
                      onChange={(event) =>
                        setRegistrationForm((current) => ({
                          ...current,
                          linhVucDeXuatId: event.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">Chọn lĩnh vực</option>
                      {fields.map((field) => (
                        <option key={field.linh_vuc_id} value={field.linh_vuc_id}>
                          {field.ten_linh_vuc}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Mục tiêu</span>
                    <input
                      value={registrationForm.mucTieuDeXuat}
                      onChange={(event) =>
                        setRegistrationForm((current) => ({
                          ...current,
                          mucTieuDeXuat: event.target.value,
                        }))
                      }
                      placeholder="Nếu có"
                    />
                  </label>

                  <label className="full-width">
                    <span>Mô tả</span>
                    <textarea
                      value={registrationForm.moTaDeXuat}
                      onChange={(event) =>
                        setRegistrationForm((current) => ({
                          ...current,
                          moTaDeXuat: event.target.value,
                        }))
                      }
                      placeholder="Mô tả ngắn gọn ý tưởng đề tài"
                    />
                  </label>

                  <label className="full-width">
                    <span>Yêu cầu</span>
                    <textarea
                      value={registrationForm.yeuCauDeXuat}
                      onChange={(event) =>
                        setRegistrationForm((current) => ({
                          ...current,
                          yeuCauDeXuat: event.target.value,
                        }))
                      }
                      placeholder="Kỹ năng, công nghệ, điều kiện cần có"
                    />
                  </label>
                </>
              )}

              <label className="full-width">
                <span>Lý do chọn đề tài</span>
                <textarea
                  value={registrationForm.lyDoChonDeTai}
                  onChange={(event) =>
                    setRegistrationForm((current) => ({
                      ...current,
                      lyDoChonDeTai: event.target.value,
                    }))
                  }
                  placeholder="Mô tả lý do bạn muốn đăng ký"
                  required
                />
              </label>

              <div className="full-width">
                <button className="primary-button" type="submit" disabled={pageLoading}>
                  Tạo đăng ký
                </button>
              </div>
            </form>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Đăng ký của tôi</p>
                <h2>Theo dõi trạng thái duyệt</h2>
              </div>
              <button className="secondary-button" type="button" onClick={loadStudentData}>
                Tải lại
              </button>
            </div>

            <div className="card-list">
              {myRegistrations.length === 0 ? (
                <div className="empty-state">Bạn chưa tạo đăng ký nào.</div>
              ) : (
                myRegistrations.map((registration) => (
                  <article className="card" key={registration.ho_so_id}>
                    <div className="card-top">
                      <h3>
                        {registration.DeTaiNghienCuu?.ten_de_tai || registration.ten_de_tai_de_xuat}
                      </h3>
                      <span className={`status-pill status-${registration.trang_thai.toLowerCase()}`}>
                        {formatRegistrationStatus(registration.trang_thai)}
                      </span>
                    </div>
                    <p><strong>Nhóm:</strong> {registration.NhomNghienCuu?.ten_nhom}</p>
                    <p>
                      <strong>Giảng viên:</strong>{' '}
                      {registration.NhomNghienCuu?.GiangVien?.ho_ten || 'Chưa chọn'}
                    </p>
                    <p><strong>Loại:</strong> {formatRegistrationType(registration.loai_dang_ky)}</p>
                    <p><strong>Lý do:</strong> {registration.ly_do_chon_de_tai || 'Không có'}</p>
                    {registration.ghi_chu ? (
                      <p><strong>Ghi chú:</strong> {registration.ghi_chu}</p>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      ) : null}

      {sessionUser.vaiTro === 'GIANG_VIEN' ? (
        <div className="dashboard-grid single-column">
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Hồ sơ gửi đến bạn</p>
                <h2>Giảng viên chỉ thấy các đề tài đăng ký với mình</h2>
              </div>
              <button className="secondary-button" type="button" onClick={loadLecturerData}>
                Tải lại
              </button>
            </div>

            <div className="card-list">
              {lecturerRegistrations.length === 0 ? (
                <div className="empty-state">Chưa có đăng ký nào gửi đến bạn.</div>
              ) : (
                lecturerRegistrations.map((registration) => (
                  <article className="card" key={registration.ho_so_id}>
                    <div className="card-top">
                      <div>
                        <h3>
                          {registration.DeTaiNghienCuu?.ten_de_tai || registration.ten_de_tai_de_xuat}
                        </h3>
                        <p className="subtle">
                          {registration.NhomNghienCuu?.SinhVien?.ho_ten} - {registration.NhomNghienCuu?.ten_nhom}
                        </p>
                      </div>
                      <span className={`status-pill status-${registration.trang_thai.toLowerCase()}`}>
                        {formatRegistrationStatus(registration.trang_thai)}
                      </span>
                    </div>

                    <p><strong>Loại:</strong> {formatRegistrationType(registration.loai_dang_ky)}</p>
                    <p><strong>Lý do đăng ký:</strong> {registration.ly_do_chon_de_tai || 'Không có'}</p>

                    {registration.loai_dang_ky === 'DE_XUAT_MOI' ? (
                      <>
                        <p><strong>Lĩnh vực:</strong> {registration.LinhVucDeXuat?.ten_linh_vuc || 'Không có'}</p>
                        <p><strong>Mô tả:</strong> {registration.mo_ta_de_xuat || 'Không có'}</p>
                        <p><strong>Mục tiêu:</strong> {registration.muc_tieu_de_xuat || 'Không có'}</p>
                      </>
                    ) : null}

                    <textarea
                      value={reviewNotes[registration.ho_so_id] || ''}
                      onChange={(event) =>
                        setReviewNotes((current) => ({
                          ...current,
                          [registration.ho_so_id]: event.target.value,
                        }))
                      }
                      placeholder="Nhập nhận xét cho sinh viên"
                    />

                    {['CHO_PHE_DUYET', 'DA_NOP'].includes(registration.trang_thai) ? (
                      <div className="action-row">
                        <button
                          className="primary-button"
                          type="button"
                          disabled={pageLoading}
                          onClick={() => handleReview(registration.ho_so_id, 'CHAP_NHAN')}
                        >
                          Chấp nhận
                        </button>
                        <button
                          className="danger-button"
                          type="button"
                          disabled={pageLoading}
                          onClick={() => handleReview(registration.ho_so_id, 'TU_CHOI')}
                        >
                          Từ chối
                        </button>
                      </div>
                    ) : (
                      <div className="locked-action">Hồ sơ này đã được xử lý.</div>
                    )}
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      ) : null}

      {isManager ? (
        <div className="dashboard-grid">
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Tổ chức bảo vệ đề tài</p>
                <h2>Xếp lịch cho các đề tài đủ điều kiện</h2>
              </div>
              <button className="secondary-button" type="button" onClick={loadManagerData}>
                Tải lại
              </button>
            </div>

            <div className="card-list">
              {eligibleTopics.length === 0 ? (
                <div className="empty-state">Không có đề tài đủ điều kiện bảo vệ.</div>
              ) : (
                eligibleTopics.map((item) => {
                  const draftKey = getDraftKey(item.de_tai_id, item.nhom_id);
                  const draft = defenseDrafts[draftKey] || {};

                  return (
                    <article className="card" key={draftKey}>
                      <div className="card-top">
                        <div>
                          <h3>{item.DeTaiNghienCuu?.ten_de_tai}</h3>
                          <p className="subtle">
                            {item.NhomNghienCuu?.ten_nhom} - GVHD: {item.NhomNghienCuu?.GiangVien?.ho_ten || 'Chưa có'}
                          </p>
                        </div>
                        <label className="checkbox-inline">
                          <input
                            type="checkbox"
                            checked={Boolean(draft.selected)}
                            onChange={(event) => handleDraftChange(draftKey, 'selected', event.target.checked)}
                          />
                          <span>Chọn xếp lịch</span>
                        </label>
                      </div>

                      <p><strong>Sinh viên:</strong> {formatStudentNames(item.NhomNghienCuu?.ThanhVienNhom)}</p>
                      <p><strong>Báo cáo cuối cùng:</strong> {item.tieu_de}</p>

                      {draft.selected ? (
                        <div className="form-grid compact-grid">
                          <label>
                            <span>Hội đồng khoa học</span>
                            <select
                              value={draft.hoiDongId || ''}
                              onChange={(event) => handleDraftChange(draftKey, 'hoiDongId', event.target.value)}
                            >
                              <option value="">Chọn hội đồng</option>
                              {councils.map((council) => (
                                <option key={council.hoi_dong_id} value={council.hoi_dong_id}>
                                  {council.ten_hoi_dong}
                                  {council.hop_le_phan_cong ? '' : ' - Chưa hợp lệ'}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label>
                            <span>Thời gian bắt đầu</span>
                            <input
                              type="datetime-local"
                              value={draft.thoiGianBatDau || ''}
                              onChange={(event) => handleDraftChange(draftKey, 'thoiGianBatDau', event.target.value)}
                            />
                          </label>

                          <label>
                            <span>Thời gian kết thúc</span>
                            <input
                              type="datetime-local"
                              value={draft.thoiGianKetThuc || ''}
                              onChange={(event) => handleDraftChange(draftKey, 'thoiGianKetThuc', event.target.value)}
                            />
                          </label>

                          <label>
                            <span>Địa điểm / phòng</span>
                            <input
                              value={draft.diaDiem || ''}
                              onChange={(event) => handleDraftChange(draftKey, 'diaDiem', event.target.value)}
                              placeholder="Ví dụ: Phòng A101"
                            />
                          </label>

                          <label className="full-width">
                            <span>Ghi chú</span>
                            <textarea
                              value={draft.ghiChu || ''}
                              onChange={(event) => handleDraftChange(draftKey, 'ghiChu', event.target.value)}
                              placeholder="Nếu có"
                            />
                          </label>
                        </div>
                      ) : null}
                    </article>
                  );
                })
              )}
            </div>

            <div className="action-row action-row-end">
              <button className="primary-button" type="button" disabled={pageLoading} onClick={handleCreateDefenseSchedules}>
                Xác nhận xếp lịch
              </button>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Lịch bảo vệ đã tạo</p>
                <h2>Theo dõi hội đồng và phòng bảo vệ</h2>
              </div>
            </div>

            <div className="card-list">
              {defenseSchedules.length === 0 ? (
                <div className="empty-state">Chưa có lịch bảo vệ nào.</div>
              ) : (
                defenseSchedules.map((schedule) => (
                  <article className="card" key={schedule.lich_bao_ve_id}>
                    <div className="card-top">
                      <div>
                        <h3>{schedule.DeTaiNghienCuu?.ten_de_tai}</h3>
                        <p className="subtle">{schedule.NhomNghienCuu?.ten_nhom}</p>
                      </div>
                      <span className="status-pill status-da_xep_lich">
                        {formatDefenseStatus(schedule.trang_thai)}
                      </span>
                    </div>
                    <p><strong>Hội đồng:</strong> {schedule.HoiDongKhoaHoc?.ten_hoi_dong}</p>
                    <p>
                      <strong>Thời gian:</strong> {formatDateTime(schedule.thoi_gian_bat_dau)} - {formatDateTime(schedule.thoi_gian_ket_thuc)}
                    </p>
                    <p><strong>Địa điểm:</strong> {schedule.dia_diem}</p>
                    <p><strong>Sinh viên:</strong> {formatStudentNames(schedule.NhomNghienCuu?.ThanhVienNhom)}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function buildDefenseDrafts(eligibleTopics, currentDrafts) {
  const nextDrafts = { ...currentDrafts };

  eligibleTopics.forEach((item) => {
    const key = getDraftKey(item.de_tai_id, item.nhom_id);
    if (!nextDrafts[key]) {
      nextDrafts[key] = {
        selected: false,
        deTaiId: item.de_tai_id,
        nhomId: item.nhom_id,
        hoiDongId: '',
        thoiGianBatDau: '',
        thoiGianKetThuc: '',
        diaDiem: '',
        ghiChu: '',
      };
    }
  });

  return nextDrafts;
}

function getDraftKey(deTaiId, nhomId) {
  return `${deTaiId}-${nhomId}`;
}

function getDashboardTitle(role) {
  if (role === 'SINH_VIEN') {
    return 'Bảng điều khiển sinh viên';
  }

  if (role === 'GIANG_VIEN') {
    return 'Bảng điều khiển giảng viên';
  }

  return 'Bảng điều khiển cán bộ quản lý';
}

function getRoleLabel(role) {
  const roleMap = {
    SINH_VIEN: 'Sinh viên',
    GIANG_VIEN: 'Giảng viên',
    CAN_BO_QUAN_LY: 'Cán bộ quản lý',
    QUAN_TRI_HE_THONG: 'Quản trị hệ thống',
  };

  return roleMap[role] || role;
}

function formatRegistrationType(value) {
  const typeMap = {
    DE_TAI_CO_SAN: 'Đề tài có sẵn',
    DE_XUAT_MOI: 'Đề xuất mới',
  };

  return typeMap[value] || value;
}

function formatRegistrationStatus(value) {
  const statusMap = {
    DA_NOP: 'Đã nộp',
    CHO_PHE_DUYET: 'Chờ phê duyệt',
    CHAP_NHAN: 'Đã chấp nhận',
    TU_CHOI: 'Từ chối',
    CAN_CHINH_SUA: 'Cần chỉnh sửa',
  };

  return statusMap[value] || value;
}

function formatDefenseStatus(value) {
  const statusMap = {
    DA_XEP_LICH: 'Đã xếp lịch',
  };

  return statusMap[value] || value;
}

function formatStudentNames(members = []) {
  return members.map((member) => member.SinhVien?.ho_ten).filter(Boolean).join(', ');
}

function formatDateTime(value) {
  return new Date(value).toLocaleString('vi-VN');
}

export default App;
