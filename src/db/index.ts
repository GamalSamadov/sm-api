/* 
Implementation of a singleton pattern for the database connection using pg library.
*/
import { Pool, QueryResult } from 'pg'

import { CONFIG } from './config'

export class DataBaseConnection {
	private static instance: Pool

	private constructor(
		private client: Pool | null = null,
		private retryCount = 0,
		private readonly maxRetries = 5
	) {
		this.initializeConnection()
	}

	private async initializeConnection() {
		try {
			this.client = new Pool(CONFIG)
			await this.testConnection()
			this.setupErrorHandling()
		} catch (error) {
			if (this.retryCount < this.maxRetries) {
				this.retryCount++
				await new Promise(resolve => setTimeout(resolve, 1000))
				await this.initializeConnection()
			} else {
				throw new Error(
					`Failed to connect to database after ${this.maxRetries} attempts`
				)
			}
		}
	}

	private async testConnection() {
		const client = await this.client!.connect()
		try {
			await client.query('SELECT NOW()')
		} finally {
			client.release()
		}
	}

	private setupErrorHandling() {
		if (!this.client) return
		process.on('SIGTERM', () => this.cleanup())
		process.on('SIGINT', () => this.cleanup())
	}

	private async cleanup() {
		if (this.client) {
			await this.client.end()
		}
	}

	public static getInstance(): Pool {
		if (!DataBaseConnection.instance) {
			const connection = new DataBaseConnection()
			if (!connection.client) {
				throw new Error('Failed to initialize database connection')
			}
			DataBaseConnection.instance = connection.client
		}
		return DataBaseConnection.instance
	}

	public static async query<T>(
		text: string,
		params?: any[]
	): Promise<QueryResult<T>> {
		const pool = DataBaseConnection.getInstance()
		try {
			const result = await pool.query<T>(text, params)
			return result
		} catch (error) {
			throw error
		}
	}
}
