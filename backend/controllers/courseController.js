const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

// @desc    Get all published courses (with search/filter)
// @route   GET /api/courses
const getCourses = async (req, res) => {
  try {
    const { keyword, category, level } = req.query;
    const filter = { published: true };

    if (keyword) {
      filter.title = { $regex: keyword, $options: 'i' };
    }
    if (category) filter.category = category;
    if (level) filter.level = level;

    const courses = await Course.find(filter)
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course by ID with lessons
// @route   GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate({ path: 'lessons', options: { sort: { order: 1 } } })
      .populate('reviews.user', 'name');

    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new course (instructor/admin only)
// @route   POST /api/courses
const createCourse = async (req, res) => {
  try {
    const { title, description, category, level, price, thumbnail } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Please provide title, description, and category' });
    }

    const course = await Course.create({
      title,
      description,
      category,
      level,
      price: price || 0,
      thumbnail,
      instructor: req.user._id,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a course (owner instructor/admin only)
// @route   PUT /api/courses/:id
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this course' });
    }

    const fields = ['title', 'description', 'category', 'level', 'price', 'thumbnail', 'published'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) course[field] = req.body[field];
    });

    const updated = await course.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await Lesson.deleteMany({ course: course._id });
    await course.deleteOne();

    res.json({ message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a lesson to a course
// @route   POST /api/courses/:id/lessons
const addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to add lessons to this course' });
    }

    const { title, content, videoUrl, duration, order } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Please provide a lesson title' });
    }

    const lesson = await Lesson.create({
      course: course._id,
      title,
      content,
      videoUrl,
      duration: duration || 0,
      order: order !== undefined ? order : course.lessons.length + 1,
    });

    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a review to a course
// @route   POST /api/courses/:id/reviews
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const alreadyReviewed = course.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You already reviewed this course' });
    }

    course.reviews.push({ user: req.user._id, rating, comment });
    course.calculateAverageRating();
    await course.save();

    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get courses created by logged-in instructor
// @route   GET /api/courses/instructor/mine
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).populate('lessons');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  addReview,
  getMyCourses,
};
