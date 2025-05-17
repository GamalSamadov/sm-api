import { Lesson } from './lesson'

export interface Student {
	student_id: string
	first_name: string
	last_name: string
	age: number
	grade: string
	registration_date: string
}

export interface StudentWithLessons extends Student {
	lessons: Lesson[]
}
