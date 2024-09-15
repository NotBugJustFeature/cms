import { mysqlTable } from 'drizzle-orm/mysql-core'

export type ColumnType = 'integer' | 'varchar' | 'text'

export interface Column {
    name: string
    type: ColumnType
    length?: number
    primaryKey?: boolean
    autoIncrement?: boolean
}

export interface Table {
    name: string
    columns: Column[]
}

export interface TablesSchema {
    tables: Table[]
}

// Exporting types for use elsewhere
export type Schemas = Record<string, ReturnType<typeof mysqlTable>>
