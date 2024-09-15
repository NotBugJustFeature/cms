import * as fs from 'fs'
import * as path from 'path'

// Define the input JSON schema file path and output TypeScript file path
const inputFilePath = path.resolve(__dirname, 'tables.json')
const outputFilePath = path.resolve(__dirname, 'generated-schema.ts')

// Define the JSON schema interface
interface Column {
    name: string
    type: string
    primaryKey?: boolean
    autoIncrement?: boolean
    length?: number
    unique?: boolean
}

interface Table {
    name: string
    columns: Column[]
}

interface Schema {
    tables: Table[]
}

// Read and parse the JSON schema file
const readSchema = (filePath: string): Schema => {
    const rawData = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(rawData) as Schema
}

// Generate TypeScript code from the schema
const generateTypeScriptCode = (schema: Schema): string => {
    const imports = `import { mysqlTable, serial, text, varchar, int } from 'drizzle-orm/mysql-core'\n`

    const tablesCode = schema.tables
        .map((table) => {
            const columnsCode = table.columns
                .map((column) => {
                    let columnType
                    switch (column.type) {
                        case 'integer':
                            columnType = 'int'
                            break
                        case 'text':
                            columnType = 'text'
                            break
                        case 'varchar':
                            columnType = 'varchar'
                            break
                        default:
                            throw new Error(`Unsupported column type: ${column.type}`)
                    }

                    const columnName = column.name
                    const lengthPart =
                        column.length && columnType === 'varchar'
                            ? `,{ length: ${column.length} }`
                            : ''

                    return `${columnName}: ${columnType}('${columnName}'${lengthPart})${
                        column.primaryKey ? '.primaryKey()' : ''
                    }${column.autoIncrement ? '.autoincrement()' : ''}${
                        column.unique ? '.unique()' : ''
                    }`
                })
                .join(',\n    ')

            return `export const ${table.name} = mysqlTable('${table.name}', {\n    ${columnsCode}\n})`
        })
        .join('\n\n')

    const exportCode = `export default {\n    ${schema.tables
        .map((table) => table.name)
        .join(',\n    ')}\n}`

    return `${imports}\n${tablesCode}\n\n${exportCode}`
}

// Generate and write the TypeScript code to the output file
const main = () => {
    const schema = readSchema(inputFilePath)
    const tsCode = generateTypeScriptCode(schema)
    fs.writeFileSync(outputFilePath, tsCode, 'utf-8')
    console.log(`Schema has been generated to ${outputFilePath}`)
}

main()
