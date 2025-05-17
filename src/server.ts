import cors from 'cors'
import * as dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import { Pool } from 'pg'

import { DataBaseConnection } from '@/db'
import lessonRouter from '@/routes/lesson.route'
import studentRouter from '@/routes/student.route'

// Load environment variables from the appropriate .env file based on NODE_ENV
if (process.env.NODE_ENV === 'production') {
	dotenv.config({ path: process.cwd() + '/.env.production' })
} else {
	dotenv.config()
}

const app = express()
const port = process.env.PORT || 4200

// Initialize Express middleware
app.use(express.json())
app.use(cors())

// Basic health check endpoint
app.get('/health', (_: Request, res: Response) => {
	res.status(200).json({
		status: 'ok',
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || 'development'
	})
})

// Handle root route
app.get('/', (_: Request, res: Response) => {
	res.status(200).json({
		message: 'Student Management API is running',
		documentation: '/api-docs',
		health: '/health'
	})
})

// Setup API routes
app.use('/api/students', studentRouter)
app.use('/api/lessons', lessonRouter)

// Test database connection (not blocking)
try {
	const db: Pool = DataBaseConnection.getInstance()
	db.query('SELECT NOW()')
		.then(result => {
			console.log('Database connection successful:', result.rows[0])
		})
		.catch(err => {
			console.error('Database connection error:', err)
		})
} catch (error) {
	console.error('Failed to initialize database connection:', error)
}

// Start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})

// Export the Express app for testing purposes
export default app
