import fs from 'fs'
import path from 'path'
import {
    int,
    varchar,
    text,
    mysqlTable,
    MySqlColumn,
    MySqlTableWithColumns
} from 'drizzle-orm/mysql-core'

// Define the types based on your JSON schema
interface Column {
    name: string
    type: 'integer' | 'varchar' | 'text'
    length?: number
    primaryKey?: boolean
    autoIncrement?: boolean
    unique?: boolean
    references?: string
}

interface Table {
    name: string
    columns: Column[]
}

interface TablesSchema {
    tables: Table[]
}

// Function to generate a column definition based on JSON
function generateCol(column: Column): MySqlColumn<any, any> {
    switch (column.type) {
        case 'integer': {
            let intCol = int(column.name)
            if (column.primaryKey) intCol = intCol.primaryKey()
            if (column.autoIncrement) intCol = intCol.autoincrement()
            return intCol as MySqlColumn<any, any>
        }
        case 'varchar': {
            return varchar(column.name, { length: column.length ?? 255 }) as MySqlColumn<any, any>
        }
        case 'text': {
            return text(column.name) as MySqlColumn<any, any>
        }
        default:
            throw new Error(`Unknown column type: ${column.type}`)
    }
}

// Read the JSON file and generate the schema
async function generateSchema() {
    try {
        const jsonFilePath = path.resolve(__dirname, 'tables.json')
        const jsonData = fs.readFileSync(jsonFilePath, 'utf-8')
        const tablesData: TablesSchema = JSON.parse(jsonData)

        const schemas: Record<string, MySqlTableWithColumns<any>> = {}

        tablesData.tables.forEach((table) => {
            const columns: Record<string, MySqlColumn<any, any>> = {}

            table.columns.forEach((column) => {
                columns[column.name] = generateCol(column)
            })

            schemas[table.name] = mysqlTable(table.name, columns) as MySqlTableWithColumns<any>
        })

        const outputFilePath = path.resolve(__dirname, 'drizzle-schema.ts')
        const outputContent = `import { mysqlTable } from 'drizzle-orm/mysql-core';

const schemas = ${JSON.stringify(schemas, null, 2)};

export default schemas;
`

        fs.writeFileSync(outputFilePath, outputContent)
        console.log('Schema file generated successfully')
    } catch (error) {
        console.error('Error generating schema file:', error)
    }
}

// Execute the script
generateSchema()
