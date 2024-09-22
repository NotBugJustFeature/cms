import { mysqlTable as table, int as integer, real, varchar, text } from 'drizzle-orm/mysql-core'

export const users = table('users', {
    id: integer('id').primaryKey().autoincrement(),
    full_name: text('full_name'),
    phone: varchar('phone',{ length: 255 }).unique()
})

export const posts = table('posts', {
    id: integer('id').primaryKey().autoincrement(),
    title: text('title'),
    content: text('content')
})

export default {
    users,
    posts
}