#!/usr/bin/env node
// filepath: /Users/gamalsamadov/Documents/projects/sm/server/src/migrations/run-migrations.js

const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

// Load environment variables from the appropriate .env file based on NODE_ENV
if (process.env.NODE_ENV === 'production') {
	dotenv.config({ path: path.resolve(process.cwd(), '.env.production') })
} else {
	dotenv.config()
}

// Database connection info from environment variables or defaults
const config = {
	user: process.env.DB_USER || 'postgres',
	host: process.env.DB_HOST || 'localhost',
	database: process.env.DB_NAME || 'student_management',
	password: process.env.DB_PASSWORD || 'postgres',
	port: parseInt(process.env.DB_PORT) || 5434 // Updated to match our Docker port
}

async function runMigrations() {
	const pool = new Pool(config)

	try {
		console.log('Connected to the database. Running migrations...')

		// Create migrations table if it doesn't exist
		await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

		// Get list of applied migrations
		const { rows: appliedMigrations } = await pool.query(
			'SELECT name FROM migrations'
		)
		const appliedMigrationNames = appliedMigrations.map(m => m.name)

		// Get all migration files
		const migrationDir = __dirname
		const migrationFiles = fs
			.readdirSync(migrationDir)
			.filter(file => file.endsWith('.sql'))
			.sort() // Sort to apply in correct order

		for (const migrationFile of migrationFiles) {
			// Skip if already applied
			if (appliedMigrationNames.includes(migrationFile)) {
				console.log(
					`Migration ${migrationFile} already applied. Skipping.`
				)
				continue
			}

			console.log(`Applying migration: ${migrationFile}`)
			const filePath = path.join(migrationDir, migrationFile)
			const sql = fs.readFileSync(filePath, 'utf8')

			// Start a transaction
			const client = await pool.connect()
			try {
				await client.query('BEGIN')

				// Run the migration
				await client.query(sql)

				// Record the migration
				await client.query(
					'INSERT INTO migrations (name) VALUES ($1)',
					[migrationFile]
				)

				await client.query('COMMIT')
				console.log(`Successfully applied migration: ${migrationFile}`)
			} catch (error) {
				await client.query('ROLLBACK')
				console.error(
					`Error applying migration ${migrationFile}:`,
					error
				)
				throw error
			} finally {
				client.release()
			}
		}

		console.log('All migrations applied successfully!')
	} catch (error) {
		console.error('Error in migration process:', error)
		process.exit(1)
	} finally {
		await pool.end()
	}
}

runMigrations()
