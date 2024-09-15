import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './src/drizzle/generated-schema.ts',
    dialect: 'mysql',
    dbCredentials: {
        host: 'localhost',
        user: 'root',
        database: 'test_drizzle'
    },
    migrations: {
        prefix: 'timestamp'
    }
})
// import { defineConfig } from 'drizzle-kit'
// import path from 'path'

// export default defineConfig({
//     schema: path.join('./src/drizzle/drizzle.ts'),
//     out: path.resolve(__dirname, 'migrations'),
//     dialect: 'mysql',
//     dbCredentials: {
//         host: 'localhost',
//         user: 'root',
//         database: 'test_drizzle'
//     },
//     migrations: {
//         prefix: 'timestamp'
//     }
// })

// export default config
