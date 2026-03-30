// Seed tất cả dữ liệu cho hệ thống
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Bắt đầu seed toàn bộ dữ liệu...\n');

  // 1. Tạo các khoa
  console.log('📚 Tạo các khoa...');
  const khoaCNTT = await prisma.khoa.upsert({
    where: { ma_khoa: 'CNTT' },
    update: {},
    create: {
      ma_khoa: 'CNTT',
      ten_khoa: 'Công nghệ Thông tin',
      email_lien_he: 'cntt@university.edu.vn',
      so_dien_thoai: '0241234567',
      trang_thai: 1,
    },
  });

  const khoaKT = await prisma.khoa.upsert({
    where: { ma_khoa: 'KT' },
    update: {},
    create: {
      ma_khoa: 'KT',
      ten_khoa: 'Kinh tế',
      email_lien_he: 'kt@university.edu.vn',
      so_dien_thoai: '0241234568',
      trang_thai: 1,
    },
  });

  const khoaNN = await prisma.khoa.upsert({
    where: { ma_khoa: 'NN' },
    update: {},
    create: {
      ma_khoa: 'NN',
      ten_khoa: 'Ngoại ngữ',
      email_lien_he: 'nn@university.edu.vn',
      so_dien_thoai: '0241234569',
      trang_thai: 1,
    },
  });

  console.log('✓ Đã tạo 3 khoa\n');

  // 2. Tạo lĩnh vực nghiên cứu
  console.log('🔬 Tạo lĩnh vực nghiên cứu...');
  const linhVucs = [
    {
      ma_linh_vuc: 'LV001',
      ten_linh_vuc: 'Trí tuệ nhân tạo',
      mo_ta: 'Nghiên cứu về AI, Machine Learning, Deep Learning',
      trang_thai: 1,
    },
    {
      ma_linh_vuc: 'LV002',
      ten_linh_vuc: 'Phát triển Web',
      mo_ta: 'Nghiên cứu về công nghệ web, framework, UX/UI',
      trang_thai: 1,
    },
    {
      ma_linh_vuc: 'LV003',
      ten_linh_vuc: 'An toàn thông tin',
      mo_ta: 'Nghiên cứu về bảo mật, mã hóa, phòng chống tấn công',
      trang_thai: 1,
    },
    {
      ma_linh_vuc: 'LV004',
      ten_linh_vuc: 'Khoa học dữ liệu',
      mo_ta: 'Nghiên cứu về phân tích dữ liệu, Big Data, Data Mining',
      trang_thai: 1,
    },
    {
      ma_linh_vuc: 'LV005',
      ten_linh_vuc: 'Internet of Things',
      mo_ta: 'Nghiên cứu về IoT, Smart Home, Embedded Systems',
      trang_thai: 1,
    },
  ];

  for (const lv of linhVucs) {
    await prisma.linhVucNghienCuu.upsert({
      where: { ma_linh_vuc: lv.ma_linh_vuc },
      update: {},
      create: lv,
    });
  }

  console.log('✓ Đã tạo 5 lĩnh vực\n');

  // 3. Tạo giảng viên
  console.log('👨‍🏫 Tạo giảng viên...');
  const giangViens = [
    {
      ma_giang_vien: 'GV001',
      ho_ten: 'TS. Nguyễn Văn An',
      email: 'nva@university.edu.vn',
      so_dien_thoai: '0901234567',
      khoa_id: khoaCNTT.khoa_id,
      chuyen_mon: 'Trí tuệ nhân tạo, Machine Learning',
      so_luong_huong_dan_toi_da: 5,
      trang_thai: 1,
    },
    {
      ma_giang_vien: 'GV002',
      ho_ten: 'PGS.TS. Trần Thị Bình',
      email: 'ttb@university.edu.vn',
      so_dien_thoai: '0901234568',
      khoa_id: khoaCNTT.khoa_id,
      chuyen_mon: 'Phát triển Web, Full-stack Development',
      so_luong_huong_dan_toi_da: 6,
      trang_thai: 1,
    },
    {
      ma_giang_vien: 'GV003',
      ho_ten: 'TS. Lê Văn Cường',
      email: 'lvc@university.edu.vn',
      so_dien_thoai: '0901234569',
      khoa_id: khoaCNTT.khoa_id,
      chuyen_mon: 'An toàn thông tin, Mã hóa',
      so_luong_huong_dan_toi_da: 4,
      trang_thai: 1,
    },
  ];

  for (const gv of giangViens) {
    await prisma.giangVien.upsert({
      where: { ma_giang_vien: gv.ma_giang_vien },
      update: {},
      create: gv,
    });
  }

  console.log('✓ Đã tạo 3 giảng viên\n');

  // 4. Lấy lĩnh vực và giảng viên để tạo đề tài
  const linhVucAI = await prisma.linhVucNghienCuu.findFirst({
    where: { ma_linh_vuc: 'LV001' },
  });
  const linhVucWeb = await prisma.linhVucNghienCuu.findFirst({
    where: { ma_linh_vuc: 'LV002' },
  });
  const linhVucSecurity = await prisma.linhVucNghienCuu.findFirst({
    where: { ma_linh_vuc: 'LV003' },
  });

  const gv1 = await prisma.giangVien.findFirst({
    where: { ma_giang_vien: 'GV001' },
  });
  const gv2 = await prisma.giangVien.findFirst({
    where: { ma_giang_vien: 'GV002' },
  });
  const gv3 = await prisma.giangVien.findFirst({
    where: { ma_giang_vien: 'GV003' },
  });

  // 5. Tạo đề tài
  console.log('📝 Tạo đề tài nghiên cứu...');
  const deTais = [
    {
      ma_de_tai: 'DT001',
      ten_de_tai: 'Ứng dụng AI trong nhận diện khuôn mặt',
      linh_vuc_id: linhVucAI.linh_vuc_id,
      mo_ta: 'Nghiên cứu và phát triển hệ thống nhận diện khuôn mặt sử dụng deep learning',
      muc_tieu: 'Xây dựng hệ thống nhận diện chính xác trên 95%',
      yeu_cau: 'Sinh viên cần có kiến thức về Python, TensorFlow',
      so_luong_thanh_vien_toi_da: 4,
      giang_vien_huong_dan_id: gv1.giang_vien_id,
      trang_thai: 'MO_DANG_KY',
      nam_hoc: '2023-2024',
      hoc_ky: '2',
    },
    {
      ma_de_tai: 'DT002',
      ten_de_tai: 'Hệ thống quản lý thư viện trực tuyến',
      linh_vuc_id: linhVucWeb.linh_vuc_id,
      mo_ta: 'Xây dựng website quản lý thư viện với React và Node.js',
      muc_tieu: 'Tạo hệ thống quản lý hiệu quả, dễ sử dụng',
      yeu_cau: 'Sinh viên cần biết JavaScript, React, Node.js',
      so_luong_thanh_vien_toi_da: 3,
      giang_vien_huong_dan_id: gv2.giang_vien_id,
      trang_thai: 'MO_DANG_KY',
      nam_hoc: '2023-2024',
      hoc_ky: '2',
    },
    {
      ma_de_tai: 'DT003',
      ten_de_tai: 'Nghiên cứu mã hóa dữ liệu blockchain',
      linh_vuc_id: linhVucSecurity.linh_vuc_id,
      mo_ta: 'Tìm hiểu và ứng dụng blockchain trong bảo mật dữ liệu',
      muc_tieu: 'Xây dựng mô hình bảo mật sử dụng blockchain',
      yeu_cau: 'Sinh viên cần có kiến thức về mật mã học',
      so_luong_thanh_vien_toi_da: 3,
      giang_vien_huong_dan_id: gv3.giang_vien_id,
      trang_thai: 'MO_DANG_KY',
      nam_hoc: '2023-2024',
      hoc_ky: '2',
    },
  ];

  for (const dt of deTais) {
    await prisma.deTaiNghienCuu.upsert({
      where: { ma_de_tai: dt.ma_de_tai },
      update: {},
      create: dt,
    });
  }

  console.log('✓ Đã tạo 3 đề tài\n');

  // 6. Tạo sinh viên
  console.log('👨‍🎓 Tạo sinh viên...');
  const sinhViens = [
    {
      ma_sinh_vien: 'SV001',
      ho_ten: 'Nguyễn Văn A',
      email: 'nva.sv@university.edu.vn',
      khoa_id: khoaCNTT.khoa_id,
      lop: 'CNTT01',
      khoa_hoc: '2021-2025',
      trang_thai: 1,
    },
    {
      ma_sinh_vien: 'SV002',
      ho_ten: 'Trần Thị B',
      email: 'ttb.sv@university.edu.vn',
      khoa_id: khoaCNTT.khoa_id,
      lop: 'CNTT01',
      khoa_hoc: '2021-2025',
      trang_thai: 1,
    },
    {
      ma_sinh_vien: 'SV003',
      ho_ten: 'Lê Văn C',
      email: 'lvc.sv@university.edu.vn',
      khoa_id: khoaCNTT.khoa_id,
      lop: 'CNTT02',
      khoa_hoc: '2021-2025',
      trang_thai: 1,
    },
    {
      ma_sinh_vien: 'SV004',
      ho_ten: 'Phạm Thị D',
      email: 'ptd.sv@university.edu.vn',
      khoa_id: khoaCNTT.khoa_id,
      lop: 'CNTT02',
      khoa_hoc: '2021-2025',
      trang_thai: 1,
    },
    {
      ma_sinh_vien: 'SV005',
      ho_ten: 'Hoàng Văn E',
      email: 'hve.sv@university.edu.vn',
      khoa_id: khoaCNTT.khoa_id,
      lop: 'CNTT03',
      khoa_hoc: '2021-2025',
      trang_thai: 1,
    },
  ];

  for (const sv of sinhViens) {
    await prisma.sinhVien.upsert({
      where: { ma_sinh_vien: sv.ma_sinh_vien },
      update: {},
      create: sv,
    });
  }

  console.log('✓ Đã tạo 5 sinh viên\n');

  // 7. Tạo nhóm nghiên cứu và thành viên nhóm
  console.log('👥 Tạo nhóm nghiên cứu và thành viên...');

  const sinhVienMap = Object.fromEntries(
    (await prisma.sinhVien.findMany()).map((sinhVien) => [sinhVien.ma_sinh_vien, sinhVien])
  );
  const giangVienMap = Object.fromEntries(
    (await prisma.giangVien.findMany()).map((giangVien) => [giangVien.ma_giang_vien, giangVien])
  );
  const deTaiMap = Object.fromEntries(
    (await prisma.deTaiNghienCuu.findMany()).map((deTai) => [deTai.ma_de_tai, deTai])
  );

  const nhoms = [
    {
      ma_nhom: 'NHOM20260001',
      ten_nhom: 'Nhóm AI Vision',
      truong_nhom_ma: 'SV001',
      de_tai_ma: 'DT001',
      loai_dang_ky: 'DE_TAI_CO_SAN',
      giang_vien_ma: 'GV001',
      trang_thai: 'DANG_THUC_HIEN',
      thanh_vien: [
        { ma_sinh_vien: 'SV001', vai_tro: 'TRUONG_NHOM' },
        { ma_sinh_vien: 'SV002', vai_tro: 'THANH_VIEN' }
      ]
    },
    {
      ma_nhom: 'NHOM20260002',
      ten_nhom: 'Nhóm Web Innovators',
      truong_nhom_ma: 'SV003',
      de_tai_ma: 'DT002',
      loai_dang_ky: 'DE_TAI_CO_SAN',
      giang_vien_ma: 'GV002',
      trang_thai: 'CHO_DUYET',
      thanh_vien: [
        { ma_sinh_vien: 'SV003', vai_tro: 'TRUONG_NHOM' },
        { ma_sinh_vien: 'SV004', vai_tro: 'THANH_VIEN' }
      ]
    },
    {
      ma_nhom: 'NHOM20260003',
      ten_nhom: 'Nhóm Security Research',
      truong_nhom_ma: 'SV005',
      de_tai_ma: null,
      loai_dang_ky: 'DE_XUAT_MOI',
      giang_vien_ma: 'GV003',
      trang_thai: 'CHO_DUYET',
      thanh_vien: [
        { ma_sinh_vien: 'SV005', vai_tro: 'TRUONG_NHOM' }
      ]
    }
  ];

  for (const nhomData of nhoms) {
    const truongNhom = sinhVienMap[nhomData.truong_nhom_ma];
    const giangVien = giangVienMap[nhomData.giang_vien_ma];
    const deTai = nhomData.de_tai_ma ? deTaiMap[nhomData.de_tai_ma] : null;

    const nhom = await prisma.nhomNghienCuu.upsert({
      where: { ma_nhom: nhomData.ma_nhom },
      update: {
        ten_nhom: nhomData.ten_nhom,
        truong_nhom_id: truongNhom.sinh_vien_id,
        de_tai_id: deTai ? deTai.de_tai_id : null,
        loai_dang_ky: nhomData.loai_dang_ky,
        giang_vien_huong_dan_id: giangVien.giang_vien_id,
        trang_thai: nhomData.trang_thai
      },
      create: {
        ma_nhom: nhomData.ma_nhom,
        ten_nhom: nhomData.ten_nhom,
        truong_nhom_id: truongNhom.sinh_vien_id,
        de_tai_id: deTai ? deTai.de_tai_id : null,
        loai_dang_ky: nhomData.loai_dang_ky,
        giang_vien_huong_dan_id: giangVien.giang_vien_id,
        so_luong_thanh_vien: nhomData.thanh_vien.length,
        trang_thai: nhomData.trang_thai
      }
    });

    for (const thanhVienData of nhomData.thanh_vien) {
      const sinhVien = sinhVienMap[thanhVienData.ma_sinh_vien];
      const existingMember = await prisma.thanhVienNhom.findFirst({
        where: {
          nhom_id: nhom.nhom_id,
          sinh_vien_id: sinhVien.sinh_vien_id
        }
      });

      if (existingMember) {
        await prisma.thanhVienNhom.update({
          where: { thanh_vien_nhom_id: existingMember.thanh_vien_nhom_id },
          data: {
            vai_tro_trong_nhom: thanhVienData.vai_tro,
            trang_thai: 1
          }
        });
      } else {
        await prisma.thanhVienNhom.create({
          data: {
            nhom_id: nhom.nhom_id,
            sinh_vien_id: sinhVien.sinh_vien_id,
            vai_tro_trong_nhom: thanhVienData.vai_tro,
            trang_thai: 1
          }
        });
      }
    }

    await prisma.nhomNghienCuu.update({
      where: { nhom_id: nhom.nhom_id },
      data: {
        so_luong_thanh_vien: nhomData.thanh_vien.length
      }
    });
  }

  console.log('✓ Đã tạo 3 nhóm nghiên cứu\n');

  // 8. Tạo hồ sơ đăng ký, phê duyệt và thông báo
  console.log('📄 Tạo hồ sơ đăng ký và dữ liệu liên quan...');

  const linhVucData = await prisma.linhVucNghienCuu.findFirst({
    where: { ma_linh_vuc: 'LV003' }
  });
  const nhomMap = Object.fromEntries(
    (await prisma.nhomNghienCuu.findMany()).map((nhom) => [nhom.ma_nhom, nhom])
  );

  const hoSoSamples = [
    {
      nhom_ma: 'NHOM20260001',
      de_tai_ma: 'DT001',
      loai_dang_ky: 'DE_TAI_CO_SAN',
      ly_do_chon_de_tai: 'Nhóm muốn phát triển sản phẩm nhận diện khuôn mặt có tính ứng dụng thực tế trong điểm danh và kiểm soát ra vào.',
      trang_thai: 'DA_DUYET',
      approval: {
        ket_qua: 'DUYET',
        nhan_xet: 'Đề tài phù hợp với năng lực nhóm, hồ sơ đầy đủ và có thể triển khai ngay.'
      }
    },
    {
      nhom_ma: 'NHOM20260002',
      de_tai_ma: 'DT002',
      loai_dang_ky: 'DE_TAI_CO_SAN',
      ly_do_chon_de_tai: 'Nhóm muốn xây dựng hệ thống web hoàn chỉnh để thực hành kiến trúc full-stack và quy trình triển khai thực tế.',
      trang_thai: 'DA_NOP',
      approval: null
    },
    {
      nhom_ma: 'NHOM20260003',
      de_tai_ma: null,
      loai_dang_ky: 'DE_XUAT_MOI',
      ly_do_chon_de_tai: 'Nhóm đề xuất hướng nghiên cứu mới để tập trung vào bảo mật dữ liệu cho ứng dụng học thuật.',
      ten_de_tai_de_xuat: 'Nền tảng giám sát an toàn dữ liệu học thuật sử dụng phát hiện bất thường',
      linh_vuc_de_xuat_id: linhVucData.linh_vuc_id,
      mo_ta_de_xuat: 'Xây dựng nền tảng phát hiện hành vi truy cập bất thường và cảnh báo sớm cho dữ liệu nghiên cứu.',
      muc_tieu_de_xuat: 'Tạo hệ thống theo dõi, phân tích log và cảnh báo nguy cơ rò rỉ dữ liệu gần thời gian thực.',
      yeu_cau_de_xuat: 'Sinh viên cần có kiến thức về bảo mật ứng dụng, phân tích log và xử lý dữ liệu.',
      trang_thai: 'CHO_PHE_DUYET',
      approval: null
    }
  ];

  for (const hoSoData of hoSoSamples) {
    const nhom = nhomMap[hoSoData.nhom_ma];
    const deTai = hoSoData.de_tai_ma ? deTaiMap[hoSoData.de_tai_ma] : null;
    const existingHoSo = await prisma.hoSoDangKyDeTai.findFirst({
      where: { nhom_id: nhom.nhom_id }
    });

    let hoSo;

    if (existingHoSo) {
      hoSo = await prisma.hoSoDangKyDeTai.update({
        where: { ho_so_id: existingHoSo.ho_so_id },
        data: {
          de_tai_id: deTai ? deTai.de_tai_id : null,
          loai_dang_ky: hoSoData.loai_dang_ky,
          ly_do_chon_de_tai: hoSoData.ly_do_chon_de_tai,
          ten_de_tai_de_xuat: hoSoData.ten_de_tai_de_xuat || null,
          linh_vuc_de_xuat_id: hoSoData.linh_vuc_de_xuat_id || null,
          mo_ta_de_xuat: hoSoData.mo_ta_de_xuat || null,
          muc_tieu_de_xuat: hoSoData.muc_tieu_de_xuat || null,
          yeu_cau_de_xuat: hoSoData.yeu_cau_de_xuat || null,
          nguoi_tao_id: nhom.truong_nhom_id,
          trang_thai: hoSoData.trang_thai
        }
      });
    } else {
      hoSo = await prisma.hoSoDangKyDeTai.create({
        data: {
          nhom_id: nhom.nhom_id,
          de_tai_id: deTai ? deTai.de_tai_id : null,
          loai_dang_ky: hoSoData.loai_dang_ky,
          ly_do_chon_de_tai: hoSoData.ly_do_chon_de_tai,
          ten_de_tai_de_xuat: hoSoData.ten_de_tai_de_xuat || null,
          linh_vuc_de_xuat_id: hoSoData.linh_vuc_de_xuat_id || null,
          mo_ta_de_xuat: hoSoData.mo_ta_de_xuat || null,
          muc_tieu_de_xuat: hoSoData.muc_tieu_de_xuat || null,
          yeu_cau_de_xuat: hoSoData.yeu_cau_de_xuat || null,
          nguoi_tao_id: nhom.truong_nhom_id,
          trang_thai: hoSoData.trang_thai
        }
      });
    }

    if (hoSoData.approval) {
      const existingApproval = await prisma.pheDuyetDeTai.findFirst({
        where: {
          ho_so_id: hoSo.ho_so_id,
          ket_qua: hoSoData.approval.ket_qua
        }
      });

      if (!existingApproval) {
        await prisma.pheDuyetDeTai.create({
          data: {
            ho_so_id: hoSo.ho_so_id,
            nguoi_duyet_id: nhom.giang_vien_huong_dan_id,
            loai_nguoi_duyet: 'GIANG_VIEN',
            ket_qua: hoSoData.approval.ket_qua,
            nhan_xet: hoSoData.approval.nhan_xet
          }
        });
      }
    }

    const thongBaos = [
      {
        tieu_de: 'Hồ sơ đăng ký đề tài',
        noi_dung: `Hồ sơ của nhóm ${nhom.ten_nhom} đang ở trạng thái ${hoSoData.trang_thai}.`,
        nguoi_nhan_id: nhom.truong_nhom_id,
        loai_nguoi_nhan: 'SINH_VIEN'
      },
      {
        tieu_de: 'Hồ sơ đăng ký đề tài mới',
        noi_dung: `Nhóm ${nhom.ten_nhom} đã tạo hồ sơ đăng ký ${hoSoData.loai_dang_ky === 'DE_TAI_CO_SAN' ? 'đề tài có sẵn' : 'đề tài đề xuất mới'}.`,
        nguoi_nhan_id: nhom.giang_vien_huong_dan_id,
        loai_nguoi_nhan: 'GIANG_VIEN'
      }
    ];

    for (const thongBaoData of thongBaos) {
      const existingThongBao = await prisma.thongBao.findFirst({
        where: {
          nguoi_nhan_id: thongBaoData.nguoi_nhan_id,
          loai_nguoi_nhan: thongBaoData.loai_nguoi_nhan,
          tieu_de: thongBaoData.tieu_de
        }
      });

      if (existingThongBao) {
        await prisma.thongBao.update({
          where: { thong_bao_id: existingThongBao.thong_bao_id },
          data: {
            noi_dung: thongBaoData.noi_dung,
            loai_thong_bao: 'DANG_KY_DE_TAI',
            da_doc: false
          }
        });
      } else {
        await prisma.thongBao.create({
          data: {
            ...thongBaoData,
            loai_thong_bao: 'DANG_KY_DE_TAI',
            da_doc: false
          }
        });
      }
    }
  }

  console.log('✓ Đã tạo 3 hồ sơ đăng ký, 1 phê duyệt và thông báo liên quan\n');

  console.log('✅ Hoàn thành seed toàn bộ dữ liệu!');
  console.log('\n📊 Tổng kết:');
  console.log('- 3 Khoa');
  console.log('- 5 Lĩnh vực');
  console.log('- 3 Giảng viên');
  console.log('- 3 Đề tài');
  console.log('- 5 Sinh viên');
  console.log('- 3 Nhóm nghiên cứu');
  console.log('- 5 Thành viên nhóm');
  console.log('- 3 Hồ sơ đăng ký');
  console.log('- 1 Phiếu phê duyệt');
  console.log('- 6 Thông báo');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
