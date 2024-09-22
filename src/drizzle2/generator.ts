import * as fs from 'fs'
import * as path from 'path'

type DataBaseType = 'mysql' | 'postgres'

const dbType: DataBaseType = 'mysql'

// Define the input JSON schema file path and output TypeScript file path
const inputFilePath = path.resolve(__dirname, 'tables.json')
const outputFilePath = path.resolve(__dirname, 'generated-schema.ts')

const importTables: Record<DataBaseType, string> = {
    mysql: `import { mysqlTable as table, int as integer, real, varchar, text } from 'drizzle-orm/mysql-core'`,
    postgres: `import { pgTable as table, integer, real, varchar, text } from 'drizzle-orm/pg-core'`
}

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
interface Relation {
    // fix this type
    table1: string
    table2: string
    type: string
    onDelete: string
    onUpdate: string
}

interface Schema {
    tables: Table[]
    relations: Relation[]
}

// Read and parse the JSON schema file
const readSchema = (filePath: string): Schema => {
    const rawData = fs.readFileSync(filePath, 'utf-8')
    return <Schema>JSON.parse(rawData)
}

// Generate TypeScript code from the schema
const generateTypeScriptCode = (schema: Schema): string => {
    const imports = importTables[dbType] + '\n'

    const tablesCode = schema.tables
        .map((table) => {
            const columnsCode = table.columns
                .map((column) => {
                    if (!['integer', 'real', 'varchar', 'text'].includes(column.type))
                        throw new Error(`Unsupported column type: ${column.type}`)
                    let columnType = column.type

                    const columnName = column.name
                    const customPart =
                        column.length && columnType === 'varchar'
                            ? `,{ length: ${column.length} }`
                            : ''

                    return (
                        `${columnName}: ${columnType}('${columnName}'` +
                        `${customPart})${column.primaryKey ? '.primaryKey()' : ''}` +
                        `${column.autoIncrement ? '.autoincrement()' : ''}` +
                        `${column.unique ? '.unique()' : ''}`
                    )
                })
                .join(',\n    ')

            return `export const ${table.name} = table('${table.name}', {\n    ${columnsCode}\n})`
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
