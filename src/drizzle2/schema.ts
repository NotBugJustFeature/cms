import { mysqlTable, serial, text, varchar, int } from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
    id: int('id').primaryKey().autoincrement(),
    full_name: text('full_name'),
    phone: text('phone').unique()
})

export const posts = mysqlTable('posts', {
    id: int('id').primaryKey().autoincrement(),
    title: text('title'),
    content: text('content')
})
export type NewUser = typeof users.$inferInsert
export type NewPost = typeof posts.$inferInsert

export default {
    users,
    posts
}
