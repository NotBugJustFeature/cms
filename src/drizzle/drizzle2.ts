import { drizzle, MySql2DrizzleConfig } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise' // Use promise-based MySQL2
import schema from './schema'
import { eq, like } from 'drizzle-orm'
import { log } from 'console'
import 'fs'
import tables from './tables.json'

function loadTables() {
    return require('./tables.json')
}
console.log(tables)

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test_drizzle'
})

export const db = drizzle(pool, {
    schema,
    mode: 'default' // or 'strict' based on your needs
})
;(async () => {
    try {
        console.log('Starting query...')

        // Perform the query
        let r = await db.query.users.findFirst({
            where: (users) => eq(users.id, 1)
        })
        if (!r) {
            console.log('User not found')
        }
        console.log(r)

        const res = await db.query.users.findMany({
            where: (users) => like(users.fullName, '%a%')
        })

        const res3 = await db.query['posts'].findMany({})
        console.log(res3)

        console.log('Query result:', res)
    } catch (error) {
        console.error('Error during query execution:', error)
    } finally {
        // Optional: Close the pool when you're done with all queries
        await pool.end()
    }

    console.log('End of script')
})()
