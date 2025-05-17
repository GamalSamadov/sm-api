
-- Update tables to use UUID instead of auto-increment IDs

-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS student_lessons;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS lessons;

-- Create lessons table with UUID
CREATE TABLE lessons (
  lesson_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_name VARCHAR(255) NOT NULL
);

-- Create students table with UUID
CREATE TABLE students (
  student_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  grade VARCHAR(50) NOT NULL,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create student_lessons join table with UUID foreign keys
CREATE TABLE student_lessons (
  student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(lesson_id) ON DELETE CASCADE,
  PRIMARY KEY (student_id, lesson_id)
);
