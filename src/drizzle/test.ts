import { Schemas, Table } from './types' // Adjust path if necessary
import schemas from './schema' // Assuming `schema` exports the generated schemas

// Type for the exported schemas
const mySchemas: Schemas = schemas

// Example of using the table type
const exampleTable: Table = {
    name: 'example',
    columns: [
        { name: 'id', type: 'integer', primaryKey: true, autoIncrement: true },
        { name: 'name', type: 'varchar', length: 255 }
    ]
}

// Further logic
