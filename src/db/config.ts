import * as dotenv from 'dotenv'

if (process.env.NODE_ENV === 'production') {
	dotenv.config({ path: process.cwd() + '/.env.production' })
} else {
	dotenv.config()
}

export const CONFIG =
	process.env.NODE_ENV === 'production' && process.env.DB_SOCKET
		? {
				user: process.env.DB_USER,
				database: process.env.DB_NAME,
				password: process.env.DB_PASSWORD,
				host: process.env.DB_SOCKET,
				// Cloud SQL specific settings
				connectionTimeoutMillis: 30000,
				max: 5,
				idleTimeoutMillis: 60000,
				ssl:
					process.env.DB_SSL === 'require'
						? { rejectUnauthorized: true }
						: false
			}
		: {
				user: process.env.DB_USER || 'postgres',
				host: process.env.DB_HOST || 'localhost',
				database: process.env.DB_NAME || 'student_management',
				password: process.env.DB_PASSWORD || 'postgres',
				port: parseInt(process.env.DB_PORT || '5432'),
				// Development settings
				connectionTimeoutMillis: 10000,
				max: 10,
				idleTimeoutMillis: 30000,
				ssl:
					process.env.DB_SSL === 'require'
						? { rejectUnauthorized: true }
						: false
			}

console.log('Using database configuration:', {
	...CONFIG,
	password: '****'
})
