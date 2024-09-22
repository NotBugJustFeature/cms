import { drizzle, MySqlDatabase } from 'drizzle-orm/mysql-core'
import { mysqlTable, mysqlSchema, mysql, primaryKey } from 'drizzle-orm/mysql-core'
import mysql2 from 'mysql2/promise'

const dbConfig = {
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
}

const pool = mysql2.createPool(dbConfig)
const db = drizzle(pool)

interface TranslationConfig {
    languages: string[]
    entities: {
        name: string
        fields: {
            [fieldName: string]: string // field name and its type, e.g., 'name': 'text'
        }
    }[]
}

const config: TranslationConfig = {
    languages: ['en', 'es', 'fr'], // Add more languages as needed
    entities: [
        {
            name: 'product',
            fields: {
                name: 'text',
                description: 'text'
            }
        }
        // You can add more entities here
    ]
}

function generateSchema(config: TranslationConfig) {
    return config.entities.map((entity) => {
        const entityName = entity.name

        const mainTable = mysqlTable(entityName + `s`, {
            id: mysql.serial('id').primaryKey().autoincrement()
        })

        const translationTable = mysqlTable(
            `${entityName}_translations`,
            {
                [`${entityName}Id`]: mysql
                    .int(`${entityName}_id`)
                    .notNull()
                    .references(() => mainTable.id),
                language: mysql.varchar('language', 2).notNull(),
                ...Object.fromEntries(
                    Object.entries(entity.fields).map(([fieldName]) => [
                        fieldName,
                        mysql.text(fieldName)
                    ])
                )
            },
            (translationTable) => ({
                pk: primaryKey(translationTable[`${entityName}Id`], translationTable.language)
            })
        )

        return { mainTable, translationTable }
    })
}

// async function seedData(db: MySqlDatabase, tables: ReturnType<typeof generateSchema>, config: TranslationConfig) {
//     const insertPromises = config.entities.flatMap((entity, index) => {
//         const mainTable = tables[index].mainTable;
//         const translationTable = tables[index].translationTable;

//         return db.insert(mainTable).values({}).returning('id').then(async ids => {
//             return db.insert(translationTable).values(
//                 config.languages.map(language => ({
//                     [`${entity.name}Id`]: ids[0].id,
//                     language: language,
//                     name: `${entity.name} in ${language}`,
//                     description: `${entity.name} description in ${language}`,
//                 }))
//             );
//         });
//     });

//     await Promise.all(insertPromises);
// }

async function main() {
    const tables = generateSchema(config)

    // Create tables in the database
    // for (const { mainTable, translationTable } of tables) {
    //     await db.execute(mainTable.createTableQuery());
    //     await db.execute(translationTable.createTableQuery());
    // }

    // await seedData(db, tables, config);

    console.log('Schema created and data seeded.')
}

main().catch((err) => console.error(err))
