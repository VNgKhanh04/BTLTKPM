// Component bộ lọc đề tài
// Thành viên 1: Màn hình danh sách đề tài và tìm kiếm

import React from 'react';
import '../styles/FilterPanel.css';

const FilterPanel = ({ fields, selectedFieldId, selectedStatus, onFilterChange }) => {
  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'MO_DANG_KY', label: 'Mở đăng ký' },
    { value: 'DANG_THUC_HIEN', label: 'Đang thực hiện' },
    { value: 'HOAN_THANH', label: 'Hoàn thành' },
    { value: 'DONG', label: 'Đã đóng' },
  ];

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label htmlFor="field-filter">Lĩnh vực:</label>
        <select
          id="field-filter"
          className="filter-select"
          value={selectedFieldId}
          onChange={(e) => onFilterChange('fieldId', e.target.value)}
        >
          <option value="">Tất cả lĩnh vực</option>
          {fields.map(field => (
            <option key={field.linh_vuc_id} value={field.linh_vuc_id}>
              {field.ten_linh_vuc}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="status-filter">Trạng thái:</label>
        <select
          id="status-filter"
          className="filter-select"
          value={selectedStatus}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
