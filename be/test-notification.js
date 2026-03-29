// Test API tạo thông báo
const API_BASE = 'http://localhost:3000/api';

async function testNotification() {
  console.log('🧪 Testing notification API...\n');

  // Test 1: Tạo thông báo với camelCase
  console.log('Test 1: Tạo thông báo (camelCase)');
  try {
    const response = await fetch(`${API_BASE}/notifications`, {
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

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Status:', response.status);
      console.log('✅ Created notification:', data);
    } else {
      console.log('❌ Status:', response.status);
      console.log('❌ Error:', data);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test 2: Tạo thông báo với snake_case
  console.log('Test 2: Tạo thông báo (snake_case)');
  try {
    const response = await fetch(`${API_BASE}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tieu_de: 'Thông báo test 2',
        noi_dung: 'Đây là thông báo test 2',
        nguoi_nhan_id: 1,
        loai_nguoi_nhan: 'SINH_VIEN',
        loai_thong_bao: 'NHAC_NHO'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Status:', response.status);
      console.log('✅ Created notification:', data);
    } else {
      console.log('❌ Status:', response.status);
      console.log('❌ Error:', data);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test 3: Lấy danh sách thông báo
  console.log('Test 3: Lấy danh sách thông báo');
  try {
    const response = await fetch(`${API_BASE}/notifications?nguoiNhanId=1&loaiNguoiNhan=SINH_VIEN`);
    const data = await response.json();
    
    console.log('✅ Status:', response.status);
    console.log('✅ Total notifications:', data.length);
    console.log('✅ Notifications:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Test completed!');
}

testNotification().catch(console.error);
