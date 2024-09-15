import { MySqlTableWithColumns, MySqlColumn } from 'drizzle-orm/mysql-core'

export type ColumnType = 'integer' | 'varchar' | 'text'

export interface Column {
    name: string
    type: ColumnType
    length?: number
    primaryKey?: boolean
    autoIncrement?: boolean
    unique?: boolean
    references?: string
}

export interface Table {
    name: string
    columns: Column[]
}

export interface TablesSchema {
    tables: Table[]
}

export type TableSchemas = {
    [key: string]: MySqlTableWithColumns<any>
}

export type ColumnSchemas<T extends TableSchemas> = {
    [K in keyof T]: {
        [C in keyof T[K]['columns']]: MySqlColumn<any, any>
    }
}
