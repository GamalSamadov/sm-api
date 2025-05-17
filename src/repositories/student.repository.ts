import { v4 as uuidv4 } from 'uuid'

import { DataBaseConnection } from '@/db'
import { Student } from '@/models/student'

export class StudentRepository {
	constructor(private db = DataBaseConnection.getInstance()) {}

	async findById(id: string): Promise<Student | null> {
		const result = await this.db.query(
			'SELECT * FROM students WHERE student_id = $1',
			[id]
		)

		return result.rows[0] || null
	}

	async create(student: Student): Promise<string> {
		const studentId = uuidv4()
		await this.db.query(
			'INSERT INTO students (student_id, first_name, last_name, age, grade, registration_date) VALUES ($1, $2, $3, $4, $5, $6)',
			[
				studentId,
				student.first_name,
				student.last_name,
				student.age,
				student.grade,
				student.registration_date
			]
		)

		return studentId
	}

	async update(student: Student): Promise<void> {
		await this.db.query(
			'UPDATE students SET first_name = $1, last_name = $2, age = $3, grade = $4, registration_date = $5 WHERE student_id = $6',
			[
				student.first_name,
				student.last_name,
				student.age,
				student.grade,
				student.registration_date,
				student.student_id
			]
		)
	}

	async delete(id: string): Promise<void> {
		await this.db.query('DELETE FROM students WHERE student_id = $1', [id])
	}

	async findAll(): Promise<Student[]> {
		const result = await this.db.query('SELECT * FROM students')
		return result.rows
	}
}
