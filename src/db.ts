/* 
Implementation of a singleton pattern for the database connection using pg library.
*/
import * as dotenv from 'dotenv'
import { Pool, QueryResult } from 'pg'

// Load environment variables from the appropriate .env file based on NODE_ENV
if (process.env.NODE_ENV === 'production') {
	dotenv.config({ path: process.cwd() + '/.env.production' })
} else {
	dotenv.config()
}

// Configuration based on environment variables
const config = {
	user: process.env.DB_USER || 'postgres',
	host: process.env.DB_HOST || 'localhost',
	database: process.env.DB_NAME || 'student_management',
	password: process.env.DB_PASSWORD || 'postgres',
	port: parseInt(process.env.DB_PORT || '5432'),
	// Add connection timeout and retry settings
	connectionTimeoutMillis: 10000,
	max: 10,
	idleTimeoutMillis: 30000
}

console.log('Using database configuration:', {
	...config,
	password: '****' // Don't log the actual password
})

console.log('Environment variables:', {
	DB_HOST: process.env.DB_HOST,
	DB_PORT: process.env.DB_PORT,
	DB_USER: process.env.DB_USER,
	DB_NAME: process.env.DB_NAME,
	DB_PASSWORD: '****'
})

export class DataBaseConnection {
	private static instance: Pool
	private client: Pool | null = null

	private constructor() {
		try {
			this.client = new Pool(config)
			this.setupErrorHandling()
		} catch (error) {
			console.error('Failed to create database connection:', error)
			throw error
		}
	}

	static getInstance(): Pool {
		if (!this.instance) {
			try {
				this.instance = new Pool(config)
				console.log('Database connection initialized')

				// Test the connection
				this.instance.on('error', err => {
					console.error(
						'Unexpected error on idle client in pool:',
						err
					)
					// Force recreation of the pool on next getInstance call
					this.instance = null
				})

				this.instance
					.query('SELECT NOW()')
					.then(() => {
						console.log('Successfully connected to the database')
					})
					.catch(err => {
						console.error('Failed to connect to the database:', err)
						// Force recreation of the pool on next getInstance call
						this.instance = null
					})
			} catch (error) {
				console.error(
					'Failed to initialize database connection:',
					error
				)
				throw error
			}
		}
		return this.instance
	}

	async query(text: string, params: any[]): Promise<QueryResult<any>> {
		if (!this.client) {
			try {
				this.client = new Pool(config)
				this.setupErrorHandling()
			} catch (error) {
				console.error(
					'Failed to create database connection for query:',
					error
				)
				throw error
			}
		}

		try {
			// Get a client from the pool
			const client = await this.client.connect()
			try {
				const result = await client.query(text, params)
				return result
			} finally {
				// Return the client to the pool
				client.release()
			}
		} catch (error) {
			console.error(
				'Database query error:',
				error,
				'Query:',
				text,
				'Params:',
				params
			)
			throw error
		}
	}

	private setupErrorHandling(): void {
		this.client?.on('error', err => {
			console.error('Unexpected error on idle client', err)
			// Attempt to reconnect
			this.client = new Pool(config)
			this.setupErrorHandling()
		})
	}
}
