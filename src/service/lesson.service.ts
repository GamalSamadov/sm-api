import { Lesson } from '@/models/lesson'
import { LessonRepository } from '@/repositories/lesson.repository'
import { StudentLessonRepository } from '@/repositories/student-lesson.repository'

export class LessonService {
	constructor(
		private lessonRepository = new LessonRepository(),
		private studentLessonRepository = new StudentLessonRepository()
	) {}

	async add(lesson: Lesson): Promise<string> {
		return await this.lessonRepository.create(lesson)
	}

	async get(id: string): Promise<Lesson | null> {
		return await this.lessonRepository.findById(id)
	}

	async getAll(): Promise<Lesson[]> {
		return await this.lessonRepository.findAll()
	}

	async update(lesson: Lesson): Promise<void> {
		await this.lessonRepository.update(lesson)
	}

	async delete(id: string): Promise<void> {
		// First remove all enrollments for this lesson
		await this.studentLessonRepository.removeEnrollmentsByLessonId(id)
		// Then delete the lesson
		await this.lessonRepository.delete(id)
	}
}
