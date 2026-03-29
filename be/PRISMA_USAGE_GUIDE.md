# Hướng dẫn sử dụng Prisma với hệ thống NCKH

## Tổng quan

Hệ thống đã được thiết lập với:
- ✅ 23 bảng trong Supabase PostgreSQL
- ✅ Prisma ORM để quản lý database
- ✅ Các quan hệ (relationships) đã được thiết lập
- ✅ Timestamps tự động (ngay_tao, ngay_cap_nhat)

## Cấu trúc thư mục

```
be/
├── prisma/
│   └── schema.prisma          # Schema định nghĩa database
├── src/
│   ├── config/
│   │   └── prisma.js          # Prisma client instance
│   ├── routes/
│   │   └── sinhvien.js        # Ví dụ route với Prisma
│   └── index.js               # Entry point
├── .env                       # Database URL
└── package.json
```

## Các thao tác cơ bản với Prisma

### 1. Tạo mới (Create)

```javascript
// Tạo sinh viên mới
const sinhVien = await prisma.sinhVien.create({
  data: {
    ma_sinh_vien: 'SV001',
    ho_ten: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    khoa_id: 1,
    lop: 'CNTT-K15',
    khoa_hoc: 'K2022'
  }
});

// Tạo với quan hệ
const nhom = await prisma.nhomNghienCuu.create({
  data: {
    ma_nhom: 'NHOM001',
    ten_nhom: 'Nhóm AI',
    truong_nhom_id: 1,
    de_tai_id: 1,
    ThanhVienNhom: {
      create: [
        { sinh_vien_id: 1, vai_tro_trong_nhom: 'TRUONG_NHOM' },
        { sinh_vien_id: 2, vai_tro_trong_nhom: 'THANH_VIEN' }
      ]
    }
  }
});
```

### 2. Đọc dữ liệu (Read)

```javascript
// Lấy tất cả
const allSinhVien = await prisma.sinhVien.findMany();

// Lấy với điều kiện
const activeSinhVien = await prisma.sinhVien.findMany({
  where: {
    trang_thai: 1,
    khoa_id: 1
  }
});

// Lấy một bản ghi
const sinhVien = await prisma.sinhVien.findUnique({
  where: { sinh_vien_id: 1 }
});

// Lấy với quan hệ (include)
const sinhVienWithKhoa = await prisma.sinhVien.findMany({
  include: {
    Khoa: true,
    ThanhVienNhom: {
      include: {
        NhomNghienCuu: true
      }
    }
  }
});

// Lấy với select (chỉ lấy một số field)
const sinhVienNames = await prisma.sinhVien.findMany({
  select: {
    sinh_vien_id: true,
    ho_ten: true,
    email: true
  }
});

// Phân trang
const page = 1;
const pageSize = 10;
const sinhViens = await prisma.sinhVien.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: {
    ngay_tao: 'desc'
  }
});

// Đếm số lượng
const count = await prisma.sinhVien.count({
  where: { trang_thai: 1 }
});
```

### 3. Cập nhật (Update)

```javascript
// Cập nhật một bản ghi
const updated = await prisma.sinhVien.update({
  where: { sinh_vien_id: 1 },
  data: {
    email: 'newemail@example.com',
    so_dien_thoai: '0123456789'
  }
});

// Cập nhật nhiều bản ghi
const updatedMany = await prisma.sinhVien.updateMany({
  where: { khoa_id: 1 },
  data: { trang_thai: 1 }
});

// Upsert (update nếu tồn tại, create nếu không)
const upserted = await prisma.sinhVien.upsert({
  where: { ma_sinh_vien: 'SV001' },
  update: { ho_ten: 'Nguyễn Văn A Updated' },
  create: {
    ma_sinh_vien: 'SV001',
    ho_ten: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    khoa_id: 1
  }
});
```

### 4. Xóa (Delete)

```javascript
// Xóa cứng (hard delete)
const deleted = await prisma.sinhVien.delete({
  where: { sinh_vien_id: 1 }
});

// Xóa nhiều
const deletedMany = await prisma.sinhVien.deleteMany({
  where: { trang_thai: 0 }
});

// Xóa mềm (soft delete) - Khuyến nghị
const softDeleted = await prisma.sinhVien.update({
  where: { sinh_vien_id: 1 },
  data: { trang_thai: 0 }
});
```

### 5. Transactions

```javascript
// Transaction để đảm bảo tính toàn vẹn dữ liệu
const result = await prisma.$transaction(async (tx) => {
  // Tạo nhóm
  const nhom = await tx.nhomNghienCuu.create({
    data: {
      ma_nhom: 'NHOM001',
      ten_nhom: 'Nhóm AI',
      truong_nhom_id: 1,
      de_tai_id: 1
    }
  });

  // Thêm thành viên
  await tx.thanhVienNhom.createMany({
    data: [
      { nhom_id: nhom.nhom_id, sinh_vien_id: 1, vai_tro_trong_nhom: 'TRUONG_NHOM' },
      { nhom_id: nhom.nhom_id, sinh_vien_id: 2, vai_tro_trong_nhom: 'THANH_VIEN' }
    ]
  });

  // Cập nhật số lượng thành viên
  await tx.nhomNghienCuu.update({
    where: { nhom_id: nhom.nhom_id },
    data: { so_luong_thanh_vien: 2 }
  });

  return nhom;
});
```

### 6. Raw Queries

```javascript
// Raw SQL query
const result = await prisma.$queryRaw`
  SELECT sv.*, k.ten_khoa 
  FROM sinh_vien sv
  JOIN khoa k ON sv.khoa_id = k.khoa_id
  WHERE sv.trang_thai = 1
`;

// Execute raw SQL
await prisma.$executeRaw`
  UPDATE sinh_vien 
  SET trang_thai = 0 
  WHERE ngay_tao < NOW() - INTERVAL '5 years'
`;
```

## Ví dụ thực tế cho các nghiệp vụ

### Đăng ký đề tài

```javascript
async function dangKyDeTai(nhomId, deTaiId, lyDo) {
  return await prisma.$transaction(async (tx) => {
    // Kiểm tra số lượng thành viên
    const nhom = await tx.nhomNghienCuu.findUnique({
      where: { nhom_id: nhomId },
      include: { ThanhVienNhom: true }
    });

    const deTai = await tx.deTaiNghienCuu.findUnique({
      where: { de_tai_id: deTaiId }
    });

    if (nhom.so_luong_thanh_vien > deTai.so_luong_thanh_vien_toi_da) {
      throw new Error('Số lượng thành viên vượt quá giới hạn');
    }

    // Tạo hồ sơ đăng ký
    const hoSo = await tx.hoSoDangKyDeTai.create({
      data: {
        nhom_id: nhomId,
        de_tai_id: deTaiId,
        ly_do_chon_de_tai: lyDo,
        trang_thai: 'CHO_PHE_DUYET'
      }
    });

    // Gửi thông báo
    await tx.thongBao.create({
      data: {
        tieu_de: 'Đăng ký đề tài mới',
        noi_dung: `Nhóm ${nhom.ten_nhom} đã đăng ký đề tài ${deTai.ten_de_tai}`,
        nguoi_nhan_id: deTai.giang_vien_huong_dan_id,
        loai_nguoi_nhan: 'GIANG_VIEN',
        loai_thong_bao: 'PHE_DUYET_DE_TAI'
      }
    });

    return hoSo;
  });
}
```

### Nộp báo cáo tiến độ

```javascript
async function nopBaoCaoTienDo(deTaiId, nhomId, data) {
  return await prisma.baoCaoTienDo.create({
    data: {
      de_tai_id: deTaiId,
      nhom_id: nhomId,
      giai_doan: data.giai_doan,
      tieu_de: data.tieu_de,
      noi_dung_tom_tat: data.noi_dung,
      ty_le_hoan_thanh: data.ty_le,
      ngay_nop: new Date(),
      trang_thai: 'DA_NOP',
      tep_dinh_kem_id: data.tep_dinh_kem_id
    },
    include: {
      DeTaiNghienCuu: true,
      NhomNghienCuu: true
    }
  });
}
```

### Lấy danh sách đề tài với thống kê

```javascript
async function getDeTaiWithStats() {
  const deTais = await prisma.deTaiNghienCuu.findMany({
    include: {
      LinhVucNghienCuu: true,
      GiangVien: true,
      NhomNghienCuu: {
        include: {
          ThanhVienNhom: true
        }
      },
      _count: {
        select: {
          NhomNghienCuu: true,
          BaoCaoTienDo: true
        }
      }
    }
  });

  return deTais.map(dt => ({
    ...dt,
    so_nhom_dang_ky: dt._count.NhomNghienCuu,
    so_bao_cao: dt._count.BaoCaoTienDo
  }));
}
```

## Best Practices

### 1. Luôn sử dụng try-catch

```javascript
router.post('/api/sinhvien', async (req, res) => {
  try {
    const sinhVien = await prisma.sinhVien.create({
      data: req.body
    });
    res.status(201).json(sinhVien);
  } catch (error) {
    console.error('Error creating sinh vien:', error);
    res.status(400).json({ 
      error: 'Không thể tạo sinh viên',
      details: error.message 
    });
  }
});
```

### 2. Validate dữ liệu trước khi insert

```javascript
function validateSinhVien(data) {
  if (!data.ma_sinh_vien || !data.ho_ten || !data.email || !data.khoa_id) {
    throw new Error('Thiếu thông tin bắt buộc');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Email không hợp lệ');
  }
  
  return true;
}
```

### 3. Sử dụng select để tối ưu performance

```javascript
// Không tốt - lấy tất cả fields
const sinhViens = await prisma.sinhVien.findMany();

// Tốt - chỉ lấy fields cần thiết
const sinhViens = await prisma.sinhVien.findMany({
  select: {
    sinh_vien_id: true,
    ma_sinh_vien: true,
    ho_ten: true,
    email: true
  }
});
```

### 4. Đóng connection khi shutdown

```javascript
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
```

## Testing với Prisma

```javascript
// Sử dụng trong tests
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

test('should create sinh vien', async () => {
  const sinhVien = await prisma.sinhVien.create({
    data: {
      ma_sinh_vien: 'TEST001',
      ho_ten: 'Test User',
      email: 'test@example.com',
      khoa_id: 1
    }
  });
  
  expect(sinhVien.ma_sinh_vien).toBe('TEST001');
});
```

## Tài liệu tham khảo

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [PostgreSQL với Prisma](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
