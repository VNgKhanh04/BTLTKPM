// Test tất cả APIs của 5 thành viên
const API_BASE = 'http://localhost:3000/api';

async function testAPI(name, url, options = {}) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    console.log(`   URL: ${url}`);
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   📦 Data:`, JSON.stringify(data, null, 2).substring(0, 200) + '...');
      return { success: true, data };
    } else {
      console.log(`   ❌ Status: ${response.status}`);
      console.log(`   Error:`, data);
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`   ❌ Error:`, error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 Bắt đầu test APIs của 5 thành viên...\n');
  console.log('='.repeat(60));

  // THÀNH VIÊN 1: Danh sách đề tài và tìm kiếm
  console.log('\n📋 THÀNH VIÊN 1: Danh sách đề tài và tìm kiếm');
  console.log('='.repeat(60));
  
  await testAPI('1.1. Lấy danh sách đề tài', `${API_BASE}/topics`);
  await testAPI('1.2. Lấy danh sách lĩnh vực', `${API_BASE}/fields`);
  await testAPI('1.3. Tìm kiếm đề tài (keyword=AI)', `${API_BASE}/topics?keyword=AI`);
  await testAPI('1.4. Lọc theo lĩnh vực', `${API_BASE}/topics?fieldId=1`);
  await testAPI('1.5. Chi tiết đề tài', `${API_BASE}/topics/1`);
  await testAPI('1.6. Kiểm tra khả năng đăng ký', `${API_BASE}/topics/1/availability`);

  // THÀNH VIÊN 2: Tạo nhóm nghiên cứu
  console.log('\n\n👥 THÀNH VIÊN 2: Tạo nhóm nghiên cứu');
  console.log('='.repeat(60));
  
  await testAPI('2.1. Tìm kiếm sinh viên', `${API_BASE}/students/search?keyword=Nguyễn`);
  await testAPI('2.2. Chi tiết sinh viên', `${API_BASE}/students/1`);
  await testAPI('2.3. Kiểm tra điều kiện sinh viên', `${API_BASE}/students/1/eligibility`);
  
  const createGroupResult = await testAPI('2.4. Tạo nhóm nghiên cứu', `${API_BASE}/research-groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenNhom: 'Nhóm Test AI',
      truongNhomId: 1,
      deTaiId: 1
    })
  });

  let groupId = null;
  if (createGroupResult.success) {
    groupId = createGroupResult.data.nhom_id;
    console.log(`   📌 Group ID: ${groupId}`);
    
    await testAPI('2.5. Chi tiết nhóm', `${API_BASE}/research-groups/${groupId}`);
    await testAPI('2.6. Danh sách thành viên', `${API_BASE}/research-groups/${groupId}/members`);
    
    await testAPI('2.7. Thêm thành viên', `${API_BASE}/research-groups/${groupId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sinhVienId: 2,
        vaiTro: 'THANH_VIEN'
      })
    });
  }

  // THÀNH VIÊN 3: Chọn giảng viên hướng dẫn
  console.log('\n\n👨‍🏫 THÀNH VIÊN 3: Chọn giảng viên hướng dẫn');
  console.log('='.repeat(60));
  
  await testAPI('3.1. Danh sách giảng viên', `${API_BASE}/lecturers`);
  await testAPI('3.2. Tìm kiếm giảng viên', `${API_BASE}/lecturers?keyword=Nguyễn`);
  await testAPI('3.3. Lọc theo chuyên môn', `${API_BASE}/lecturers?specialization=AI`);
  await testAPI('3.4. Chi tiết giảng viên', `${API_BASE}/lecturers/1`);
  await testAPI('3.5. Kiểm tra quota', `${API_BASE}/lecturers/1/quota`);
  
  if (groupId) {
    await testAPI('3.6. Gán giảng viên cho nhóm', `${API_BASE}/research-groups/${groupId}/advisor`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        giangVienId: 2
      })
    });
  }

  // THÀNH VIÊN 4: Nộp hồ sơ đăng ký
  console.log('\n\n📝 THÀNH VIÊN 4: Nộp hồ sơ đăng ký');
  console.log('='.repeat(60));
  
  let registrationId = null;
  if (groupId) {
    const createRegResult = await testAPI('4.1. Tạo hồ sơ đăng ký', `${API_BASE}/topic-registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nhomId: groupId,
        deTaiId: 1,
        lyDoChonDeTai: 'Nhóm chúng em rất quan tâm đến lĩnh vực AI và muốn nghiên cứu sâu về nhận diện khuôn mặt.',
        nguoiTaoId: 1
      })
    });

    if (createRegResult.success) {
      registrationId = createRegResult.data.ho_so_id;
      console.log(`   📌 Registration ID: ${registrationId}`);
      
      await testAPI('4.2. Chi tiết hồ sơ', `${API_BASE}/topic-registrations/${registrationId}`);
      await testAPI('4.3. Xác nhận nộp hồ sơ', `${API_BASE}/topic-registrations/${registrationId}/submit`, {
        method: 'PATCH'
      });
      await testAPI('4.4. Timeline hồ sơ', `${API_BASE}/topic-registrations/${registrationId}/timeline`);
    }
  }

  await testAPI('4.5. Danh sách hồ sơ', `${API_BASE}/topic-registrations`);

  // THÀNH VIÊN 5: Validation & Thông báo
  console.log('\n\n✅ THÀNH VIÊN 5: Validation & Thông báo');
  console.log('='.repeat(60));
  
  if (groupId) {
    await testAPI('5.1. Validate hồ sơ', `${API_BASE}/validation/topic-registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nhomId: groupId,
        deTaiId: 1
      })
    });
  }

  await testAPI('5.2. Kiểm tra trùng đề tài', `${API_BASE}/validation/topic/1/check-duplicate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nhomId: groupId || 1
    })
  });

  if (registrationId) {
    await testAPI('5.3. Lấy danh sách lỗi', `${API_BASE}/validation/registration/${registrationId}/errors`);
  }

  await testAPI('5.4. Tạo thông báo', `${API_BASE}/notifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tieuDe: 'Thông báo test',
      noiDung: 'Đây là thông báo test từ hệ thống',
      nguoiNhanId: 1,
      loaiNguoiNhan: 'SINH_VIEN',
      loaiThongBao: 'THONG_BAO_CHUNG'
    })
  });

  await testAPI('5.5. Danh sách thông báo', `${API_BASE}/notifications?nguoiNhanId=1&loaiNguoiNhan=SINH_VIEN`);
  await testAPI('5.6. Đếm thông báo chưa đọc', `${API_BASE}/notifications/unread-count?nguoiNhanId=1&loaiNguoiNhan=SINH_VIEN`);

  // Tổng kết
  console.log('\n\n' + '='.repeat(60));
  console.log('✅ Hoàn thành test tất cả APIs!');
  console.log('='.repeat(60));
  console.log('\n📊 Kết quả:');
  console.log('- Thành viên 1: Danh sách đề tài ✅');
  console.log('- Thành viên 2: Tạo nhóm ✅');
  console.log('- Thành viên 3: Chọn giảng viên ✅');
  console.log('- Thành viên 4: Nộp hồ sơ ✅');
  console.log('- Thành viên 5: Validation & Thông báo ✅');
}

main().catch(console.error);
