import { Router } from 'express'

import { StudentController } from '@/controller/student.controller'

const router = Router()
const studentController = new StudentController()

// Get a student by ID
router.get('/:id', studentController.get.bind(studentController))
// Add a new student
router.post('/', studentController.add.bind(studentController))
// Get all students
router.get('/', studentController.getAll.bind(studentController))
// Update a student
router.put('/', studentController.update.bind(studentController))
// Delete a student
router.delete('/:id', studentController.delete.bind(studentController))

export default router
