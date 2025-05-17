import { v4 as uuidv4 } from 'uuid'

import { DataBaseConnection } from '@/db'
import { Lesson } from '@/models/lesson'

export class LessonRepository {
	constructor(private db = DataBaseConnection.getInstance()) {}

	async findById(id: string): Promise<Lesson | null> {
		const result = await this.db.query(
			'SELECT * FROM lessons WHERE lesson_id = $1',
			[id]
		)

		return result.rows[0] || null
	}

	async create(lesson: Lesson): Promise<string> {
		const lessonId = uuidv4()
		await this.db.query(
			'INSERT INTO lessons (lesson_id, lesson_name) VALUES ($1, $2)',
			[lessonId, lesson.lesson_name]
		)

		return lessonId
	}

	async update(lesson: Lesson): Promise<void> {
		await this.db.query(
			'UPDATE lessons SET lesson_name = $1 WHERE lesson_id = $2',
			[lesson.lesson_name, lesson.lesson_id]
		)
	}

	async delete(id: string): Promise<void> {
		await this.db.query('DELETE FROM lessons WHERE lesson_id = $1', [id])
	}

	async findAll(): Promise<Lesson[]> {
		const result = await this.db.query('SELECT * FROM lessons')
		return result.rows
	}
}
