import { DataBaseConnection } from '@/db'
import { Lesson } from '@/models/lesson'

export class StudentLessonRepository {
	constructor(private db = DataBaseConnection.getInstance()) {}

	async addEnrollment(studentId: string, lessonId: string): Promise<void> {
		await this.db.query(
			'INSERT INTO student_lessons (student_id, lesson_id) VALUES ($1, $2) ON CONFLICT (student_id, lesson_id) DO NOTHING',
			[studentId, lessonId]
		)
	}

	async findLessonsByStudentId(studentId: string): Promise<Lesson[]> {
		const result = await this.db.query(
			'SELECT l.lesson_id, l.lesson_name FROM lessons l JOIN student_lessons sl ON l.lesson_id = sl.lesson_id WHERE sl.student_id = $1',
			[studentId]
		)
		return result.rows as Lesson[] // Cast result rows to Lesson array
	}

	// Remove all enrollment links for a specific student ID
	async removeEnrollmentsByStudentId(studentId: string): Promise<boolean> {
		const result = await this.db.query(
			'DELETE FROM student_lessons WHERE student_id = $1',
			[studentId]
		)
		return result.rowCount > 0 // Return true if any rows were deleted
	}

	// (Optional: Add method to remove a specific enrollment link)
	async removeEnrollment(
		studentId: string,
		lessonId: string
	): Promise<boolean> {
		const result = await this.db.query(
			'DELETE FROM student_lessons WHERE student_id = $1 AND lesson_id = $2',
			[studentId, lessonId]
		)
		return result.rowCount > 0 // Return true if any rows were deleted
	}

	// Remove all enrollment links for a specific lesson ID
	async removeEnrollmentsByLessonId(lessonId: string): Promise<boolean> {
		const result = await this.db.query(
			'DELETE FROM student_lessons WHERE lesson_id = $1',
			[lessonId]
		)
		return result.rowCount > 0 // Return true if any rows were deleted
	}
}
