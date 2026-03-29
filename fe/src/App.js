// App chính - Thành viên 1, 2, 3, 4, 5
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TopicList from './components/TopicList';
import TopicDetail from './components/TopicDetail';
import CreateGroup from './components/CreateGroup';
import LecturerList from './components/LecturerList';
import RegistrationReview from './components/RegistrationReview';
import RegistrationStatus from './components/RegistrationStatus';
import NotificationList from './components/NotificationList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Hệ thống Quản lý Nghiên cứu Khoa học</h1>
        </header>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/topics" replace />} />
            <Route path="/topics" element={<TopicList />} />
            <Route path="/topics/:id" element={<TopicDetail />} />
            
            {/* Thành viên 2: Tạo nhóm */}
            <Route path="/register-topic/propose" element={<CreateGroup />} />
            <Route path="/register-topic/:topicId" element={<CreateGroup />} />
            
            {/* Thành viên 3: Chọn giảng viên hướng dẫn */}
            <Route path="/select-lecturer/:groupId" element={<LecturerList />} />
            
            {/* Thành viên 4: Nộp hồ sơ đăng ký */}
            <Route path="/register-topic/review/:groupId" element={<RegistrationReview />} />
            <Route path="/register-topic/:topicId/review/:groupId" element={<RegistrationReview />} />
            <Route path="/registration-status/:registrationId" element={<RegistrationStatus />} />
            
            {/* Thành viên 5: Thông báo */}
            <Route path="/notifications" element={<NotificationList />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>© 2024 Hệ thống Quản lý Nghiên cứu Khoa học</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
