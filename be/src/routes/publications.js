const express = require('express');
const router = express.Router();
const Publication = require('../models/Publication');

router.get('/', async (req, res) => {
  try {
    const publications = await Publication.find().populate('authors project');
    res.json(publications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const publication = new Publication(req.body);
  try {
    const newPublication = await publication.save();
    res.status(201).json(newPublication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id).populate('authors project');
    if (!publication) return res.status(404).json({ message: 'Không tìm thấy' });
    res.json(publication);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const publication = await Publication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(publication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Publication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
