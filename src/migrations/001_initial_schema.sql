-- Initial schema migration

-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create lessons table with UUID
CREATE TABLE IF NOT EXISTS lessons (
  lesson_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_name VARCHAR(255) NOT NULL
);

-- Create students table with UUID
CREATE TABLE IF NOT EXISTS students (
  student_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  grade VARCHAR(50) NOT NULL,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create student_lessons join table with UUID foreign keys
CREATE TABLE IF NOT EXISTS student_lessons (
  student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(lesson_id) ON DELETE CASCADE,
  PRIMARY KEY (student_id, lesson_id)
);
