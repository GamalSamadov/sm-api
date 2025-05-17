import { Request, Response } from 'express'

import { StudentService } from '@/service/student.service'

export class StudentController {
	constructor(private studentService = new StudentService()) {}

	async add(req: Request, res: Response) {
		try {
			const studentId = await this.studentService.add(
				req.body.student,
				req.body.lessonIds
			)

			res.status(201).json({
				id: studentId,
				message: 'Student created successfully'
			})
		} catch (error) {
			res.status(500).json({ error: 'Internal server error' })
		}
	}

	async get(req: Request, res: Response) {
		try {
			const student = await this.studentService.get(req.params.id)

			if (!student) {
				return res.status(404).json({ error: 'Student not found' })
			}

			res.status(200).json(student)
		} catch (error) {
			res.status(500).json({ error: 'Internal server error' })
		}
	}

	async getAll(_: Request, res: Response) {
		try {
			const students = await this.studentService.getAll()
			res.status(200).json(students)
		} catch (error) {
			res.status(500).json({ error: 'Internal server error' })
		}
	}

	async update(req: Request, res: Response) {
		try {
			await this.studentService.update(req.body.student)
			res.status(200).json({ message: 'Student updated successfully' })
		} catch (error) {
			res.status(500).json({ error: 'Internal server error' })
		}
	}

	async delete(req: Request, res: Response) {
		try {
			await this.studentService.delete(req.params.id)
			res.status(200).json({ message: 'Student deleted successfully' })
		} catch (error) {
			res.status(500).json({ error: 'Internal server error' })
		}
	}
}
