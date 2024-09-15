import { int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core'
import { TablesSchema, Column, Table } from './types' // Adjust path if necessary
import tables from './tables.json'

// Type assertion for tables.json
const tablesData: TablesSchema = tables as TablesSchema

// Function to generate columns based on JSON
function generateCol(column: Column) {
    switch (column.type) {
        case 'integer':
            let intCol = int(column.name)
            if (column.primaryKey) intCol = intCol.primaryKey()
            if (column.autoIncrement) intCol = intCol.autoincrement()
            return intCol

        case 'varchar':
            return varchar(column.name, { length: column.length || 255 })

        case 'text':
            return text(column.name)

        default:
            throw new Error(`Unknown column type: ${column.type}`)
    }
}
type tablenames = 'users' | 'posts'
// Generate table schemas dynamically
const schemas: Record<tablenames, ReturnType<typeof mysqlTable> | undefined> = {
    users: undefined,
    posts: undefined
}

tablesData.tables.forEach((table: Table) => {
    const columns: Record<string, ReturnType<typeof generateCol>> = {}

    table.columns.forEach((column: Column) => {
        columns[column.name] = generateCol(column)
    })

    schemas[table.name as tablenames] = mysqlTable(table.name, columns)
})
// export const user = [...schemaArr]
export default schemas
// module.exports = schemas
// export['user'] = schemas['user']
// export
