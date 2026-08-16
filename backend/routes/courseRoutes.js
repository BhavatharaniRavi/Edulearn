const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  addReview,
  getMyCourses,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCourses);
router.get('/instructor/mine', protect, authorize('instructor', 'admin'), getMyCourses);
router.get('/:id', getCourseById);

router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

router.post('/:id/lessons', protect, authorize('instructor', 'admin'), addLesson);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
