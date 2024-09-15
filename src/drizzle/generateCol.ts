import { int, varchar, text, MySqlColumn } from 'drizzle-orm/mysql-core'
import { Column } from './types' // Adjust path if necessary

function generateCol(column: Column): ReturnType<typeof int | typeof varchar | typeof text> {
    switch (column.type) {
        case 'integer': {
            let intCol = int(column.name)
            if (column.primaryKey) intCol = intCol.primaryKey()
            if (column.autoIncrement) intCol = intCol.autoincrement()
            return intCol
        }
        case 'varchar': {
            return varchar(column.name, { length: column.length ?? 255 })
        }
        case 'text': {
            return text(column.name)
        }
        default:
            throw new Error(`Unknown column type: ${column.type}`)
    }
}

export default generateCol
