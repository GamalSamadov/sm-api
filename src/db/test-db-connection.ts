// Test script to verify the database connection
import { DataBaseConnection } from '.'
import * as dotenv from 'dotenv'
import { Pool } from 'pg'

// Load environment variables from the appropriate .env file based on NODE_ENV
if (process.env.NODE_ENV === 'production') {
	dotenv.config({ path: process.cwd() + '/.env.production' })
} else {
	dotenv.config()
}

// Print environment variables for debugging (mask password)
console.log('Environment variables:')
console.log({
	DB_HOST: process.env.DB_HOST,
	DB_PORT: process.env.DB_PORT,
	DB_USER: process.env.DB_USER,
	DB_NAME: process.env.DB_NAME,
	DB_PASSWORD: process.env.DB_PASSWORD ? '****' : 'not set'
})

// Direct connection config
const directConfig = {
	user: process.env.DB_USER || 'postgres',
	host: process.env.DB_HOST || 'localhost',
	database: process.env.DB_NAME || 'student_management',
	password: process.env.DB_PASSWORD || 'postgres',
	port: parseInt(process.env.DB_PORT || '5432')
}

async function testConnection() {
	console.log('Testing database connection...')

	try {
		// Try direct connection first
		console.log('Trying direct connection with hardcoded credentials...')
		const directPool = new Pool(directConfig)

		try {
			const directResult = await directPool.query('SELECT NOW()')
			console.log('Direct connection successful!')
			console.log(
				'Current timestamp from database:',
				directResult.rows[0].now
			)
		} catch (directError) {
			console.error('Direct connection failed:', directError)
		} finally {
			await directPool.end()
		}

		// Now try with singleton
		console.log('\nTrying connection with singleton...')
		const db = DataBaseConnection.getInstance()
		console.log('Got database instance, attempting query...')

		const result = await db.query('SELECT NOW()', [])
		console.log('Database connection successful!')
		console.log('Current timestamp from database:', result.rows[0].now)

		// Test tables existence
		console.log('\nChecking database tables...')
		const tablesResult = await db.query(
			`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `,
			[]
		)

		if (tablesResult.rows.length === 0) {
			console.log(
				'No tables found in the database. You might need to run migrations.'
			)
		} else {
			console.log('Tables in the database:')
			tablesResult.rows.forEach((row, index) => {
				console.log(`${index + 1}. ${row.table_name}`)
			})
		}

		process.exit(0)
	} catch (error) {
		console.error('Database connection test failed:', error)
		process.exit(1)
	}
}

console.log('Starting database connection test...')
testConnection().catch(error => {
	console.error('Unhandled error in test:', error)
	process.exit(1)
})
