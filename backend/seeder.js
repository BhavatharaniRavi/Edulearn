const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Course = require('./models/Course');

dotenv.config();
connectDB();

const seedCourses = async () => {
  try {
    const instructorEmail = 'instructor@example.com';
    let instructor = await User.findOne({ email: instructorEmail });

    if (!instructor) {
      instructor = await User.create({
        name: 'Sample Instructor',
        email: instructorEmail,
        password: 'password123',
        role: 'instructor',
      });
      console.log('Created instructor:', instructor.email);
    } else {
      console.log('Using existing instructor:', instructor.email);
    }

    const sampleCourses = [
      {
        title: 'JavaScript for Beginners',
        description: 'Learn the fundamentals of JavaScript, from variables and functions to DOM manipulation and events.',
        category: 'Programming',
        level: 'Beginner',
        price: 19.99,
        thumbnail: 'https://via.placeholder.com/400x225?text=JavaScript',
      },
      {
        title: 'React Basics',
        description: 'Build interactive user interfaces with React, hooks, components, and state management.',
        category: 'Web Development',
        level: 'Beginner',
        price: 24.99,
        thumbnail: 'https://via.placeholder.com/400x225?text=React',
      },
      {
        title: 'Node.js REST APIs',
        description: 'Create backend REST APIs using Node.js, Express, and MongoDB for full-stack applications.',
        category: 'Backend',
        level: 'Intermediate',
        price: 29.99,
        thumbnail: 'https://via.placeholder.com/400x225?text=Node.js',
      },
      {
        title: 'UI/UX Design Fundamentals',
        description: 'Master design principles, wireframing, and usability testing for modern product interfaces.',
        category: 'Design',
        level: 'Beginner',
        price: 14.99,
        thumbnail: 'https://via.placeholder.com/400x225?text=Design',
      },
      {
        title: 'Data Structures & Algorithms',
        description: 'Study common data structures and algorithms used in software development and coding interviews.',
        category: 'Computer Science',
        level: 'Advanced',
        price: 34.99,
        thumbnail: 'https://via.placeholder.com/400x225?text=Algorithms',
      },
    ];

    for (const courseData of sampleCourses) {
      const existingCourse = await Course.findOne({ title: courseData.title, instructor: instructor._id });
      if (existingCourse) {
        console.log('Skipping existing course:', courseData.title);
        continue;
      }

      await Course.create({
        ...courseData,
        instructor: instructor._id,
      });
      console.log('Created course:', courseData.title);
    }

    console.log('Seeding completed. 5 courses are now available.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedCourses();
