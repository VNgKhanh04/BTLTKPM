// Test tạo nhóm
const API_BASE = 'http://localhost:3000/api';

async function test() {
  console.log('🧪 Testing create group API...\n');

  try {
    const response = await fetch(`${API_BASE}/research-groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenNhom: 'Test Group 2',
        truongNhomId: 1,
        deTaiId: 1
      })
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Group created successfully!');
    } else {
      console.log('\n❌ Failed to create group');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

test();
