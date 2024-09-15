import schema, { NewUser } from './generated-schema' // Adjust path if necessary
import schemas from './drizzle'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import { eq, like } from 'drizzle-orm'

// const schema: Schemas = schemas

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test_drizzle'
})

export const db = drizzle(pool, {
    schema: schemas,
    // schema,
    mode: 'default' // or 'strict' based on your needs
})
;(async () => {
    try {
        console.log('Starting query...')

        // Perform the query
        const r = await db.query.users.findFirst({
            where: (users) => eq(users.id, 1)
        })
        if (!r) {
            console.log('User not found')
        }
        console.log(r)

        const res = await db.query.users.findMany({
            where: (users) => like(users.full_name, '%a%') // Updated field name
        })

        // await db.insert(schema.users).values({
        //     full_name: 'asd',
        //     phone: '1234567890'
        // })
        await db.insert(schemas.users).values({})
        const res3 = await db.query.posts.findMany({}) // Use correct table name
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
