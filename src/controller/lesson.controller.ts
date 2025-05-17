import { Request, Response } from 'express'

import { LessonService } from '@/service/lesson.service'

export class LessonController {
	constructor(private lessonService = new LessonService()) {}

	async add(req: Request, res: Response) {
		try {
			console.log('Received lesson data:', req.body.lesson)

			const lessonId = await this.lessonService.add(req.body.lesson)

			res.status(201).json({
				id: lessonId,
				message: 'Lesson created successfully'
			})
		} catch (error) {
			console.error('Error adding lesson:', error)
			res.status(500).json({
				error: 'Internal server error',
				details: error instanceof Error ? error.message : String(error)
			})
		}
	}

	async get(req: Request, res: Response) {
		try {
			const lesson = await this.lessonService.get(req.params.id)

			if (!lesson) {
				return res.status(404).json({ error: 'Lesson not found' })
			}

			res.status(200).json(lesson)
		} catch (error) {
			res.status(500).json({ error: 'Internal server error' })
		}
	}

	async getAll(_: Request, res: Response) {
		try {
			const lessons = await this.lessonService.getAll()
			res.status(200).json(lessons)
		} catch (error) {
			res.status(500).json({ error: 'Internal server error' })
		}
	}

	async update(req: Request, res: Response) {
		try {
			await this.lessonService.update(req.body.lesson)
			res.status(200).json({ message: 'Lesson updated successfully' })
		} catch (error) {
			res.status(500).json({ error: 'Internal server error' })
		}
	}

	async delete(req: Request, res: Response) {
		try {
			await this.lessonService.delete(req.params.id)
			res.status(200).json({ message: 'Lesson deleted successfully' })
		} catch (error) {
			res.status(500).json({ error: 'Internal server error' })
		}
	}
}
