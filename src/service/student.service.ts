import { Student, StudentWithLessons } from '@/models/student'
import { StudentLessonRepository } from '@/repositories/student-lesson.repository'
import { StudentRepository } from '@/repositories/student.repository'

export class StudentService {
	constructor(
		private studentRepository = new StudentRepository(),
		private studentLessonRepository = new StudentLessonRepository()
	) {}

	async add(student: Student, lessonIds: string[]): Promise<string> {
		const studentId = await this.studentRepository.create(student)

		for (const lessonId of lessonIds) {
			await this.studentLessonRepository.addEnrollment(
				studentId,
				lessonId
			)
		}

		return studentId
	}

	async get(id: string) {
		const student = await this.studentRepository.findById(id)
		const lessons =
			await this.studentLessonRepository.findLessonsByStudentId(id)

		return { ...student, lessons }
	}

	async getAll(): Promise<StudentWithLessons[]> {
		const students = await this.studentRepository.findAll()
		const studentsWithLessons = await Promise.all(
			students.map(async student => {
				const lessons =
					await this.studentLessonRepository.findLessonsByStudentId(
						student.student_id
					)
				return { ...student, lessons }
			})
		)

		return studentsWithLessons
	}

	async update(student: Student): Promise<void> {
		await this.studentRepository.update(student)
	}

	async delete(id: string): Promise<void> {
		await this.studentLessonRepository.removeEnrollmentsByStudentId(id)
		await this.studentRepository.delete(id)
	}
}
