// filepath: /Users/gamalsamadov/Documents/projects/sm/server/src/routes/lesson.route.ts
import { Router } from 'express'

import { LessonController } from '@/controller/lesson.controller'

const router = Router()
const lessonController = new LessonController()

// Get a lesson by ID
router.get('/:id', lessonController.get.bind(lessonController))
// Add a new lesson
router.post('/', lessonController.add.bind(lessonController))
// Get all lessons
router.get('/', lessonController.getAll.bind(lessonController))
// Update a lesson
router.put('/', lessonController.update.bind(lessonController))
// Delete a lesson
router.delete('/:id', lessonController.delete.bind(lessonController))

export default router
