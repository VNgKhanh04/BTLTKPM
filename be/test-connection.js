// Test database connection
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Count records
    const khoaCount = await prisma.khoa.count();
    const deTaiCount = await prisma.deTaiNghienCuu.count();
    const linhVucCount = await prisma.linhVucNghienCuu.count();
    const sinhVienCount = await prisma.sinhVien.count();
    const giangVienCount = await prisma.giangVien.count();
    const nhomCount = await prisma.nhomNghienCuu.count();
    
    console.log('\n📊 Current database state:');
    console.log(`- Khoa: ${khoaCount}`);
    console.log(`- Lĩnh vực: ${linhVucCount}`);
    console.log(`- Đề tài: ${deTaiCount}`);
    console.log(`- Sinh viên: ${sinhVienCount}`);
    console.log(`- Giảng viên: ${giangVienCount}`);
    console.log(`- Nhóm nghiên cứu: ${nhomCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
