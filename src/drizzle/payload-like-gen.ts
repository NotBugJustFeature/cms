import { mysqlTable, MySqlTableWithColumns, TableConfig, text } from 'drizzle-orm/mysql-core'
import schema from './payload-like'

let res: Record<string, MySqlTableWithColumns<TableConfig>> = {}
for (const table of Object.values(schema)) {
    console.log(table)
    for (const field of table.fields) {
        console.log(field)
        // for (const payload of Object.values(field)) {
        //     console.log(payload)
        // }
    }
    res[table.slug] = mysqlTable(table.slug, {
        total: text('total')
    })
}
