import { mysqlTable, serial, text, varchar, int } from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
    id: int('id').primaryKey().autoincrement(),
    fullName: text('full_name'),
    phone: varchar('phone', { length: 256 })
})

export const posts = mysqlTable('posts', {
    id: int('id').primaryKey().autoincrement(),
    title: text('title'),
    content: varchar('content', { length: 256 })
})
export default {
    users,
    posts
}
