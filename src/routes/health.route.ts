import express from 'express'

import { DataBaseConnection } from '../db'

const router = express.Router()

router.get('/health', async (req, res) => {
	try {
		// Check database connection
		await DataBaseConnection.query('SELECT 1')

		res.status(200).json({
			status: 'healthy',
			timestamp: new Date().toISOString(),
			database: 'connected'
		})
	} catch (error) {
		console.error('Health check failed:', error)
		res.status(503).json({
			status: 'unhealthy',
			timestamp: new Date().toISOString(),
			database: 'disconnected',
			error: error.message
		})
	}
})

export default router
