const express = require('express');
const router = express.Router();
const Researcher = require('../models/Researcher');

// Lấy danh sách nhà nghiên cứu
router.get('/', async (req, res) => {
  try {
    const researchers = await Researcher.find();
    res.json(researchers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo nhà nghiên cứu mới
router.post('/', async (req, res) => {
  const researcher = new Researcher(req.body);
  try {
    const newResearcher = await researcher.save();
    res.status(201).json(newResearcher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Lấy thông tin nhà nghiên cứu theo ID
router.get('/:id', async (req, res) => {
  try {
    const researcher = await Researcher.findById(req.params.id);
    if (!researcher) return res.status(404).json({ message: 'Không tìm thấy' });
    res.json(researcher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cập nhật thông tin
router.put('/:id', async (req, res) => {
  try {
    const researcher = await Researcher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(researcher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa nhà nghiên cứu
router.delete('/:id', async (req, res) => {
  try {
    await Researcher.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
